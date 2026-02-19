import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/config/db';
import ExecPosition from '../../../../lib/models/ExecPositionModel';
import Account from '../../../../lib/models/AccountModel';

// GET - Fetch all exec positions
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    let query = {};
    if (activeOnly) {
      query.isActive = true;
    }

    const positions = await ExecPosition.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      positions,
      count: positions.length
    });

  } catch (error) {
    console.error('❌ Get exec positions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exec positions' },
      { status: 500 }
    );
  }
}

// POST - Create new exec position
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { 
      title, 
      description,
      questions,
      isActive,
      createdBy 
    } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required fields' },
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

    // Process questions
    let processedQuestions = [];
    if (questions && Array.isArray(questions)) {
      processedQuestions = questions
        .filter(q => q.text && q.text.trim().length > 0)
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

    const newPosition = new ExecPosition({
      title: title.trim(),
      description: description.trim(),
      questions: processedQuestions,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      createdBy: createdBy || null,
    });

    const savedPosition = await newPosition.save();
    await savedPosition.populate('createdBy', 'name email');

    console.log('✅ Exec position created successfully:', savedPosition._id);

    return NextResponse.json({
      success: true,
      message: 'Exec position created successfully',
      position: savedPosition
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Create exec position error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create exec position' },
      { status: 500 }
    );
  }
}
