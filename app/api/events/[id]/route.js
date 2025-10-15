// app/api/events/[id]/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/config/db';
import Event from '../../../../lib/models/EventModel';
import Account from '../../../../lib/models/AccountModel';

// GET - Fetch single event
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const event = await Event.findById(id).populate('createdBy', 'name email');

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      event
    });

  } catch (error) {
    console.error('❌ Get event error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT - Update event
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const { title, location, date, tags, imageUrl, description } = body;

    // Validation
    if (!title || !location || !date) {
      return NextResponse.json(
        { error: 'Title, location, and date are required fields' },
        { status: 400 }
      );
    }

    // Check if event exists
    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check for duplicates (same title + date)
    const duplicateEvent = await Event.findOne({
      _id: { $ne: id },
      title: { $regex: new RegExp(`^${title}$`, 'i') },
      date: new Date(date)
    });

    if (duplicateEvent) {
      return NextResponse.json(
        { error: 'An event with this title and date already exists' },
        { status: 409 }
      );
    }

    // Process tags
    let processedTags = [];
    if (tags) {
      if (Array.isArray(tags)) {
        processedTags = tags.map(tag => tag.trim()).filter(tag => tag.length > 0);
      } else if (typeof tags === 'string') {
        processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
    }

    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        location: location.trim(),
        date: new Date(date),
        tags: processedTags,
        imageUrl: imageUrl?.trim() || null,
        description: description.trim()
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    console.log('✅ Event updated successfully:', updatedEvent._id);

    return NextResponse.json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent
    });

  } catch (error) {
    console.error('❌ Update event error:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE - Delete event
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Delete the event
    await Event.findByIdAndDelete(id);

    console.log('✅ Event deleted successfully:', id);

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete event error:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
