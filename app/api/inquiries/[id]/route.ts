import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, AuthenticatedRequest } from '@/lib/middleware/auth';

// PUT /api/inquiries/[id] - Update inquiry (respond to inquiry)
async function updateInquiry(
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: params.id },
      select: { id: true, agentId: true }
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    // Check permissions - only the agent or admin can respond
    if (request.user?.role === 'AGENT' && inquiry.agentId !== request.user.userId) {
      return NextResponse.json(
        { error: 'You can only respond to inquiries for your properties' },
        { status: 403 }
      );
    }

    if (request.user?.role === 'USER') {
      return NextResponse.json(
        { error: 'Users cannot update inquiries' },
        { status: 403 }
      );
    }

    const { response, status } = await request.json();

    const updateData: any = {};

    if (response) {
      updateData.response = response;
      updateData.status = 'RESPONDED';
      updateData.respondedAt = new Date();
    }

    if (status && ['PENDING', 'RESPONDED', 'CLOSED'].includes(status.toUpperCase())) {
      updateData.status = status.toUpperCase();
    }

    const updatedInquiry = await prisma.inquiry.update({
      where: { id: params.id },
      data: updateData,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            type: true,
            address: true,
            city: true,
            state: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Inquiry updated successfully',
      inquiry: updatedInquiry
    }, { status: 200 });

  } catch (error: any) {
    console.error('Inquiry update error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const PUT = requireAuth(updateInquiry);
