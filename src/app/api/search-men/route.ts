import { NextRequest, NextResponse } from 'next/server';
import MenProfile from '../../../../models/menProfile';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query || query.trim() === '') {
      return NextResponse.json({ profiles: [] });
    }
    
    const searchRegex = new RegExp(query, 'i');
    
    const profiles = await MenProfile.find({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { instagram: searchRegex },
        { linkedin: searchRegex },
        { facebook: searchRegex }
      ]
    }).select('uuid firstName lastName instagram linkedin facebook');
    
    return NextResponse.json({ profiles });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search profiles' },
      { status: 500 }
    );
  }
}