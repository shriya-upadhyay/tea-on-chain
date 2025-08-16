import { NextRequest, NextResponse } from 'next/server';
import MenProfile from '../../../../../models/menProfile';
import connectDB from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    await connectDB();
    
    const { uuid } = await params; // Await params first
    
    const profile = await MenProfile.findOne({ uuid });
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
