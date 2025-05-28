import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware/auth';
import { AuthenticatedRequest } from '@/lib/types/auth';

// GET /api/agents - Get all agents
async function getAgents(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const verification = searchParams.get('verification') || '';
    const city = searchParams.get('city') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      role: 'AGENT', // Only get users with AGENT role
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { agencyName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && status !== 'all') {
      switch (status) {
        case 'active':
          where.isActive = true;
          break;
        case 'inactive':
          where.isActive = false;
          break;
      }
    }

    if (verification && verification !== 'all') {
      where.verificationStatus = verification.toUpperCase();
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    const [agents, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          phone: true,
          bio: true,
          isVerified: true,
          isActive: true,
          verificationStatus: true,
          licenseNumber: true,
          agencyName: true,
          experienceYears: true,
          specializations: true,
          city: true,
          state: true,
          createdAt: true,
          lastLoginAt: true,
          _count: {
            select: {
              properties: true,
              agentInquiries: true,
              givenReviews: true,
            },
          },
        },
        orderBy: [
          { verificationStatus: 'asc' }, // Verified first
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Transform the data to match frontend expectations
    const transformedAgents = agents.map(agent => ({
      ...agent,
      _count: {
        properties: agent._count.properties,
        inquiries: agent._count.agentInquiries,
        reviews: agent._count.givenReviews,
      },
    }));

    return NextResponse.json({
      agents: transformedAgents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get agents error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/agents - Create new agent (Admin only)
async function createAgent(request: AuthenticatedRequest) {
  try {
    // Check if user is admin
    if (request.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const {
      name,
      email,
      password,
      phone,
      licenseNumber,
      agencyName,
      experienceYears,
      specializations = [],
      city,
      state,
      bio,
    } = await request.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    const agent = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'AGENT',
        phone,
        licenseNumber,
        agencyName,
        experienceYears: experienceYears ? parseInt(experienceYears) : null,
        specializations,
        city,
        state,
        bio,
        isActive: true,
        verificationStatus: 'PENDING',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        licenseNumber: true,
        agencyName: true,
        experienceYears: true,
        specializations: true,
        city: true,
        state: true,
        bio: true,
        isVerified: true,
        isActive: true,
        verificationStatus: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Agent created successfully',
        agent,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create agent error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getAgents);
export const POST = requireAuth(createAgent);
