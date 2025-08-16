import { NextRequest, NextResponse } from 'next/server';
import Review from '../../../../models/review';
import connectDB from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { review, man, woman } = body;
    
    // Validate required fields
    if (!review || !man || !woman) {
      return NextResponse.json(
        { error: 'Review, man, and woman are required' },
        { status: 400 }
      );
    }
    
    // Generate unique UUID for the review
    const uuid = uuidv4();
    
    // Create new review
    const newReview = new Review({
      uuid,
      review,
      man,
      woman
    });
    
    await newReview.save();
    
    return NextResponse.json({ 
      success: true, 
      review: newReview,
      message: 'Review created successfully' 
    });
    
  } catch (error) {
    console.error('Review creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}