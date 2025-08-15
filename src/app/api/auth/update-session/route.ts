// app/api/auth/update-session/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch the fresh user data from database
    const freshUserData = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        image: true,
        id: true
      }
    });

    if (!freshUserData) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Return the fresh user data
    return NextResponse.json({ user: freshUserData });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { message: 'Error updating session' },
      { status: 500 }
    );
  }
}