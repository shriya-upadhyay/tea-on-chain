import { NextRequest, NextResponse } from 'next/server';
import MenProfile from '../../../../models/menProfile';
import connectDB from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { firstName, lastName, instagram, linkedin, facebook} = body;
    
    // Validate required fields
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }
    
    // Generate unique UUID for the profile
    const uuid = uuidv4();
    
    // Create new profile
    const newProfile = new MenProfile({
      uuid,
      firstName,
      lastName,
      instagram,
      linkedin,
      facebook
    });
    
    await newProfile.save();
    
    return NextResponse.json({ 
      success: true, 
      profile: newProfile,
      message: 'Profile created successfully' 
    });
    
  } catch (error) {
    console.error('Profile creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}