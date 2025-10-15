// app/api/events/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/config/db';
import Event from '../../../lib/models/EventModel';
import Account from '../../../lib/models/AccountModel';

// GET - Fetch all events
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const tags = searchParams.get('tags') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Build search query
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (tags && tags !== 'all') {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Fetch events with pagination and populate createdBy
    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments(query);

    return NextResponse.json({
      success: true,
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Get events error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST - Create new event
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, location, date, tags, imageUrl, description, createdBy } = body;

    if (!title || !location || !date) {
      return NextResponse.json(
        { error: 'Title, location, and date are required fields' },
        { status: 400 }
      );
    }

    // Validate createdBy user
    if (createdBy) {
      const user = await Account.findById(createdBy);
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid user ID' },
          { status: 400 }
        );
      }
    }

    // Check if an event with same title and date exists
    const existingEvent = await Event.findOne({
      title: { $regex: new RegExp(`^${title}$`, 'i') },
      date: new Date(date)
    });

    if (existingEvent) {
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

    // Create event
    const newEvent = new Event({
      title: title.trim(),
      location: location.trim(),
      date: new Date(date),
      tags: processedTags,
      imageUrl: imageUrl?.trim() || null,
      description: description.trim(),
      createdBy: createdBy || null,
      startTime: body.startTime || '09:00 AM',
      endTime: body.endTime || '05:00 PM',
      category: body.category || 'General',
    });

    const savedEvent = await newEvent.save();
    await savedEvent.populate('createdBy', 'name email');

    console.log('✅ Event created successfully:', savedEvent._id);

    return NextResponse.json({
      success: true,
      message: 'Event created successfully',
      event: savedEvent
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Create event error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

// PUT - Update event (handled in /api/events/[id])
export async function PUT() {
  return NextResponse.json(
    { error: 'Use /api/events/[id] for updating specific events' },
    { status: 405 }
  );
}

// DELETE - Delete event (handled in /api/events/[id])
export async function DELETE() {
  return NextResponse.json(
    { error: 'Use /api/events/[id] for deleting specific events' },
    { status: 405 }
  );
}
