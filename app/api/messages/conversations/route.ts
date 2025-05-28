import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware/auth';
import { AuthenticatedRequest } from '@/lib/types/auth';

// GET /api/messages/conversations - Get user's conversations
async function getConversations(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;
    const userId = request.user?.userId;

    // Build where clause for conversations where user is a participant
    const where: any = {
      OR: [
        { userId: userId },
        { agentId: userId },
      ],
    };

    if (search) {
      where.AND = [
        {
          OR: [
            {
              user: {
                name: { contains: search, mode: 'insensitive' }
              }
            },
            {
              agent: {
                name: { contains: search, mode: 'insensitive' }
              }
            },
            {
              property: {
                title: { contains: search, mode: 'insensitive' }
              }
            }
          ]
        }
      ];
    }

    const [conversations, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              role: true,
            },
          },
          agent: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              role: true,
            },
          },
          property: {
            select: {
              id: true,
              title: true,
              images: {
                where: { isPrimary: true },
                select: { url: true },
                take: 1,
              },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.inquiry.count({ where }),
    ]);

    // Transform conversations to include participant info and last message
    const transformedConversations = conversations.map(inquiry => {
      const isUserSender = inquiry.userId === userId;
      const participant = isUserSender ? inquiry.agent : inquiry.user;
      
      return {
        id: inquiry.id,
        participant: participant ? {
          id: participant.id,
          name: participant.name,
          avatar: participant.avatar,
          role: participant.role,
        } : null,
        lastMessage: {
          content: inquiry.message,
          timestamp: inquiry.updatedAt,
          senderId: inquiry.userId,
        },
        unreadCount: 0, // TODO: Implement unread count
        property: inquiry.property ? {
          id: inquiry.property.id,
          title: inquiry.property.title,
          image: inquiry.property.images[0]?.url,
        } : null,
        createdAt: inquiry.createdAt,
        updatedAt: inquiry.updatedAt,
      };
    }).filter(conv => conv.participant !== null);

    return NextResponse.json({
      conversations: transformedConversations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/messages/conversations - Create new conversation
async function createConversation(request: AuthenticatedRequest) {
  try {
    const {
      participantId,
      propertyId,
      message,
    } = await request.json();

    const userId = request.user?.userId;

    // Check if conversation already exists
    const existingInquiry = await prisma.inquiry.findFirst({
      where: {
        userId: userId,
        agentId: participantId,
        propertyId: propertyId,
      },
    });

    if (existingInquiry) {
      return NextResponse.json(
        { error: 'Conversation already exists' },
        { status: 400 }
      );
    }

    // Get property details to determine agent
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { agentId: true },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Create new inquiry (conversation)
    const inquiry = await prisma.inquiry.create({
      data: {
        userId: userId!,
        agentId: property.agentId!,
        propertyId: propertyId,
        message: message,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            images: {
              where: { isPrimary: true },
              select: { url: true },
              take: 1,
            },
          },
        },
      },
    });

    // Transform response
    const isUserSender = inquiry.userId === userId;
    const participant = isUserSender ? inquiry.agent : inquiry.user;

    const conversation = {
      id: inquiry.id,
      participant: {
        id: participant.id,
        name: participant.name,
        avatar: participant.avatar,
        role: participant.role,
      },
      lastMessage: {
        content: inquiry.message,
        timestamp: inquiry.updatedAt,
        senderId: inquiry.userId,
      },
      unreadCount: 0,
      property: {
        id: inquiry.property.id,
        title: inquiry.property.title,
        image: inquiry.property.images[0]?.url,
      },
      createdAt: inquiry.createdAt,
      updatedAt: inquiry.updatedAt,
    };

    return NextResponse.json(
      {
        message: 'Conversation created successfully',
        conversation,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create conversation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getConversations);
export const POST = requireAuth(createConversation);
