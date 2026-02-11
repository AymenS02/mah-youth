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
    const category = searchParams.get('category') || '';
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

    if (category && category !== 'all') {
      query.category = category;
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
      createdBy 
    } = body;

    // Validate required fields
    if (!title || !description || !location || !date || !startTime || !endTime || !category) {
      return NextResponse.json(
        { error: 'Title, description, location, date, start time, end time, and category are required fields' },
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

    // Process speakers array
    let processedSpeakers = [];
    if (speakers) {
      if (Array.isArray(speakers)) {
        processedSpeakers = speakers.map(speaker => speaker.trim()).filter(speaker => speaker.length > 0);
      } else if (typeof speakers === 'string') {
        processedSpeakers = speakers.split(',').map(speaker => speaker.trim()).filter(speaker => speaker.length > 0);
      }
    }

    // Process registration questions
    let processedQuestions = [];
    if (registrationQuestions && Array.isArray(registrationQuestions)) {
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

    // Create event with all fields
    const newEvent = new Event({
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      date: new Date(date),
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      category: category.trim(),
      capacity: capacity ? parseInt(capacity) : 0,
      imageUrl: imageUrl?.trim() || null,
      registrationLink: registrationLink?.trim() || null,
      isOnline: Boolean(isOnline),
      speakers: processedSpeakers,
      price: price ? parseFloat(price) : 0,
      registrationQuestions: processedQuestions,
      registeredAttendees: 0,
      createdBy: createdBy || null,
    });

    const savedEvent = await newEvent.save();
    await savedEvent.populate('createdBy', 'name email');

    console.log('✅ Event created successfully:', savedEvent._id);
    console.log('📝 Registration questions:', processedQuestions.length);

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