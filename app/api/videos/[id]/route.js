// app/api/videos/[id]/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/config/db';
import Video from '../../../../lib/models/VideoModel';
import Account from '../../../../lib/models/AccountModel';

// GET - Fetch single video
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const video = await Video.findById(id).populate('createdBy', 'name email');

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      video
    });

  } catch (error) {
    console.error('❌ Get video error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    );
  }
}

// PUT - Update video
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const {
      title,
      author,
      category,
      videoUrl,
      description,
      createdBy,
    } = body;

    // Validation
    if (!title || !author || !category || !videoUrl || !createdBy) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Check if video exists
    const existingVideo = await Video.findById(id);
    if (!existingVideo) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Check if another video with same title and author exists (excluding current video)
    const duplicateVideo = await Video.findOne({ 
      _id: { $ne: id },
      title: { $regex: new RegExp(`^${title}$`, 'i') }, 
      author: { $regex: new RegExp(`^${author}$`, 'i') }
    });
    
    if (duplicateBook) {
      return NextResponse.json(
        { error: 'A video with this title and author already exists' },
        { status: 409 }
      );
    }

    // Update video
    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        videoUrl: videoUrl.trim(),
        description: description.trim(),
        createdBy: createdBy.trim(),
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    console.log('✅ Video updated successfully:', updatedVideo._id);

    return NextResponse.json({
      success: true,
      message: 'Video updated successfully',
      video: updatedVideo
    });

  } catch (error) {
    console.error('❌ Update video error:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

// DELETE - Delete video
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Check if video exists
    const video = await Video.findById(id);
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Delete the video
    await Video.findByIdAndDelete(id);

    console.log('✅ Video deleted successfully:', id);

    return NextResponse.json({
      success: true,
      message: 'Video deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete video error:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}