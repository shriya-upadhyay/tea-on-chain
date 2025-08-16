import { NextRequest, NextResponse } from 'next/server';
import Review from '../../../../../models/review';
import connectDB from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    await connectDB();
    
    const { uuid } = await params; // Await params first
    
    const reviews = await Review.find({ man: uuid });
    
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Reviews fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
