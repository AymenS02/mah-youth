// app/api/events/[id]/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/config/db';
import Event from '../../../../lib/models/EventModel';
import Account from '../../../../lib/models/AccountModel';

// GET - Fetch single event
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

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

    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const { 
      title, 
      description,
      location, 
      date, 
      startTime,
      endTime,
      category,
      capacity,
      imageUrl, 
      registrationLink,
      isOnline,
      speakers,
      price,
      registrationQuestions,
      tags // Legacy field support
    } = body;

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

    // Check for duplicates (same title + date, but not this event)
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

    // Process speakers array
    let processedSpeakers = [];
    if (speakers) {
      if (Array.isArray(speakers)) {
        processedSpeakers = speakers.map(speaker => speaker.trim()).filter(speaker => speaker.length > 0);
      } else if (typeof speakers === 'string') {
        processedSpeakers = speakers.split(',').map(speaker => speaker.trim()).filter(speaker => speaker.length > 0);
      }
    }

    // Process tags (legacy support)
    let processedTags = [];
    if (tags) {
      if (Array.isArray(tags)) {
        processedTags = tags.map(tag => tag.trim()).filter(tag => tag.length > 0);
      } else if (typeof tags === 'string') {
        processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
    }

    // Process registration questions
    let processedQuestions = [];
    if (registrationQuestions !== undefined) {
      if (Array.isArray(registrationQuestions)) {
        processedQuestions = registrationQuestions
          .filter(q => q.text && q.text.trim().length > 0) // Only include questions with text
          .map(q => ({
            id: q.id,
            text: q.text.trim(),
            type: q.type || 'text',
            required: Boolean(q.required),
            options: (q.options && Array.isArray(q.options)) 
              ? q.options
                  .filter(opt => opt.text && opt.text.trim().length > 0)
                  .map(opt => ({
                    id: opt.id,
                    text: opt.text.trim()
                  }))
              : []
          }));
      }
    }

    // Build update object with only provided fields
    const updateData = {
      title: title.trim(),
      location: location.trim(),
      date: new Date(date),
      description: description?.trim() || existingEvent.description,
      imageUrl: imageUrl !== undefined ? (imageUrl?.trim() || null) : existingEvent.imageUrl,
    };

    // Add optional fields only if provided
    if (startTime !== undefined) updateData.startTime = startTime.trim();
    if (endTime !== undefined) updateData.endTime = endTime.trim();
    if (category !== undefined) updateData.category = category.trim();
    if (capacity !== undefined) updateData.capacity = parseInt(capacity);
    if (registrationLink !== undefined) updateData.registrationLink = registrationLink?.trim() || null;
    if (isOnline !== undefined) updateData.isOnline = Boolean(isOnline);
    if (speakers !== undefined) updateData.speakers = processedSpeakers;
    if (price !== undefined) updateData.price = parseFloat(price) || 0;
    if (tags !== undefined) updateData.tags = processedTags;
    if (registrationQuestions !== undefined) updateData.registrationQuestions = processedQuestions;

    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    console.log('✅ Event updated successfully:', updatedEvent._id);
    if (registrationQuestions !== undefined) {
      console.log('📝 Registration questions updated:', processedQuestions.length);
    }

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