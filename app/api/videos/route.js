// app/api/videos/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/config/db';
import Video from '../../../lib/models/VideoModel';
import Account from '../../../lib/models/AccountModel';

// GET - Fetch all videos
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Build search query
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }

    // Fetch videos with pagination and populate createdBy
    const videos = await Video.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Video.countDocuments(query);

    return NextResponse.json({
      success: true,
      videos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Get videos error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

// POST - Create new video
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Debug logs to see what's being received
    console.log('Received thumbnailUrl:', body.thumbnailUrl);
    console.log('Processed thumbnailUrl:', body.thumbnailUrl?.trim() || '');

    const {
      title,
      author,
      category,
      videoUrl,
      thumbnailUrl, // Now we'll actually use this variable
      description,
      createdBy
    } = body;

    // Validation - only check fields that exist in the video model
    if (!title || !author || !category || !videoUrl) {
      return NextResponse.json(
        { error: 'Title, author, category, and video URL are required' },
        { status: 400 }
      );
    }

    // Validate that createdBy user exists
    if (createdBy) {
      const user = await Account.findById(createdBy);
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid user ID' },
          { status: 400 }
        );
      }
    }

    // Check if video with same title and author already exists
    const existingVideo = await Video.findOne({ 
      title: { $regex: new RegExp(`^${title}$`, 'i') }, 
      author: { $regex: new RegExp(`^${author}$`, 'i') }
    });

    if (existingVideo) {
      return NextResponse.json(
        { error: 'A video with this title and author already exists' },
        { status: 409 }
      );
    }

    // Create new video - use the destructured thumbnailUrl variable
    const newVideo = new Video({
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      videoUrl: videoUrl.trim(),
      thumbnailUrl: thumbnailUrl?.trim() || '', // Use the destructured variable
      description: description?.trim() || '', // Optional field
      createdBy: createdBy || undefined
    });

    const savedVideo = await newVideo.save();

    // Populate the createdBy field for response
    await savedVideo.populate('createdBy', 'name email');

    console.log('✅ Video created successfully:', savedVideo._id);

    return NextResponse.json({
      success: true,
      message: 'Video created successfully',
      video: savedVideo
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Create video error:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}

// PUT - Update video (handled in individual video route)
export async function PUT() {
  return NextResponse.json(
    { error: 'Use /api/videos/[id] for updating specific videos' },
    { status: 405 }
  );
}

// DELETE - Delete multiple videos (handled in individual video route for single delete)
export async function DELETE() {
  return NextResponse.json(
    { error: 'Use /api/videos/[id] for deleting specific videos' },
    { status: 405 }
  );
}