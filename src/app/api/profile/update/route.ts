import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Verify user is authenticated
    const session = await getServerSession(authConfig);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const formData = await req.formData();
    
    // Extract data from form
    const username = formData.get('username') as string;
    const profileImage = formData.get('profileImage') as File | null;

    // Prepare update data
    const updateData: any = {};
    
    // Update username if provided
    if (username) {
      updateData.name = username;
    }

    // Handle profile image upload
    if (profileImage) {
      const profileImageBuffer = Buffer.from(await profileImage.arrayBuffer());
      const profileImageName = `${Date.now()}-${profileImage.name.replace(/\s+/g, '_')}`;
      
      // Create directories if they don't exist
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile');
      try {
        await fs.mkdir(uploadDir, { recursive: true });
      } catch (error) {
        console.error('Error creating directory:', error);
      }
      
      const profileImagePath = path.join(uploadDir, profileImageName);
      
      // Write file
      await writeFile(profileImagePath, profileImageBuffer);
      
      // Set image URL in update data
      updateData.image = `/uploads/profile/${profileImageName}`;
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    console.log('User updated successfully:', updatedUser);

    return NextResponse.json({
      message: 'Profile updated successfully',
      profileImageUrl: updateData.image || null,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Error updating profile', error: (error instanceof Error) ? error.message : String(error) },
      { status: 500 }
    );
  }
}