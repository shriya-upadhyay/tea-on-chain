import { NextRequest, NextResponse } from 'next/server';
import WomenProfile from '../../../../models/womenProfile';
import connectDB from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { fernid, username, walletAddress } = body;
    
    // Validate required fields
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }
    
    // Check if woman already exists by username or walletAddress
    const existingUser = await WomenProfile.findOne({
      $or: [
        { username: username },
        ...(walletAddress ? [{ walletAddress: walletAddress }] : []),
        ...(fernid ? [{ fernid: fernid }] : [])
      ]
    });
    
    if (existingUser) {
      // Return existing user info
      return NextResponse.json({ 
        success: false,
        exists: true,
        message: 'User already exists',
        profile: {
          uuid: existingUser.uuid,
          username: existingUser.username,
          staked: existingUser.staked
        }
      }, { status: 409 }); // 409 Conflict
    }
    
    // Generate unique UUID for the profile
    const uuid = uuidv4();
    
    // Create new woman profile
    const newProfile = new WomenProfile({
      uuid,
      fernid: fernid || null,
      username,
      walletAddress: walletAddress || null,
      staked: false,
      reported: [],
      reviews: [],
      reports: 0
    });
    
    await newProfile.save();
    
    return NextResponse.json({ 
      success: true, 
      profile: newProfile,
      message: 'Woman account created successfully' 
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Woman account creation error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create woman account' },
      { status: 500 }
    );
  }
}

// GET endpoint to check if woman exists
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const walletAddress = searchParams.get('walletAddress');
    const fernid = searchParams.get('fernid');
    const uuid = searchParams.get('uuid');
    
    if (!username && !walletAddress && !fernid && !uuid) {
      return NextResponse.json(
        { error: 'Please provide username, walletAddress, fernid, or uuid to check' },
        { status: 400 }
      );
    }
    
    // Build query
    const query: any = { $or: [] };
    if (username) query.$or.push({ username });
    if (walletAddress) query.$or.push({ walletAddress });
    if (fernid) query.$or.push({ fernid });
    if (uuid) query.$or.push({ uuid });
    
    const existingUser = await WomenProfile.findOne(query)
      .populate('reviews')
      .select('-__v'); // Exclude version key
    
    if (existingUser) {
      return NextResponse.json({
        exists: true,
        profile: existingUser
      });
    }
    
    return NextResponse.json({
      exists: false,
      message: 'User not found'
    });
    
  } catch (error) {
    console.error('Error checking woman account:', error);
    return NextResponse.json(
      { error: 'Failed to check woman account' },
      { status: 500 }
    );
  }
}