import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/config/db';
import Video from '../../../../lib/models/VideoModel';
import Account from '../../../../lib/models/AccountModel';

// GET single video
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params; // ✅ FIXED

    if (!id) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    const video = await Video.findById(id).populate('createdBy', 'name email');

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, video });
  } catch (error) {
    console.error('❌ Get video error:', error);
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
  }
}

// PUT - update video
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params; // ✅ FIXED
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    const {
      title,
      author,
      category,
      videoUrl,
      thumbnailUrl,
      description,
      createdBy,
    } = body;

    // Validation
    if (!title || !author || !category || !videoUrl || !createdBy) {
      return NextResponse.json({ error: 'All required fields must be provided' }, { status: 400 });
    }

    const existingVideo = await Video.findById(id);
    if (!existingVideo) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Duplicate check
    const duplicateVideo = await Video.findOne({
      _id: { $ne: id },
      title: { $regex: new RegExp(`^${title}$`, 'i') },
      author: { $regex: new RegExp(`^${author}$`, 'i') },
    });

    if (duplicateVideo) {
      return NextResponse.json({ error: 'A video with this title and author already exists' }, { status: 409 });
    }

    // Update
    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        videoUrl: videoUrl.trim(),
        thumbnailUrl: thumbnailUrl?.trim() || '',
        description: description?.trim() || '',
        createdBy,
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    return NextResponse.json({ success: true, message: 'Video updated successfully', video: updatedVideo });
  } catch (error) {
    console.error('❌ Update video error:', error);
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
  }
}

// DELETE video
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params; // ✅ FIXED

    if (!id) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    const video = await Video.findById(id);
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    await Video.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    console.error('❌ Delete video error:', error);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}
