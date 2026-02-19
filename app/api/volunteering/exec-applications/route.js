import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/config/db';
import ExecPositionApplication from '../../../../lib/models/ExecPositionApplicationModel';
import ExecPosition from '../../../../lib/models/ExecPositionModel';

// GET - Fetch all exec position applications
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const positionId = searchParams.get('position');
    const status = searchParams.get('status');

    let query = {};
    if (positionId) {
      query.position = positionId;
    }
    if (status) {
      query.status = status;
    }

    const applications = await ExecPositionApplication.find(query)
      .populate('position', 'title description')
      .sort({ appliedAt: -1 });

    return NextResponse.json({
      success: true,
      applications,
      count: applications.length
    });

  } catch (error) {
    console.error('❌ Get exec position applications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exec position applications' },
      { status: 500 }
    );
  }
}

// POST - Create new exec position application
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { 
      positionId,
      firstName,
      lastName,
      email,
      phone,
      questionAnswers
    } = body;

    // Validate required fields
    if (!positionId || !firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Position, first name, last name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Verify position exists
    const position = await ExecPosition.findById(positionId);
    if (!position) {
      return NextResponse.json(
        { error: 'Position not found' },
        { status: 404 }
      );
    }

    // Check if application already exists
    const existingApplication = await ExecPositionApplication.findOne({ 
      position: positionId,
      email: email.toLowerCase() 
    });
    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this position with this email' },
        { status: 409 }
      );
    }

    const newApplication = new ExecPositionApplication({
      position: positionId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      questionAnswers: questionAnswers || [],
      status: 'pending'
    });

    const savedApplication = await newApplication.save();
    await savedApplication.populate('position', 'title description');

    console.log('✅ Exec position application created successfully:', savedApplication._id);

    return NextResponse.json({
      success: true,
      message: 'Exec position application submitted successfully',
      application: savedApplication
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Create exec position application error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit exec position application' },
      { status: 500 }
    );
  }
}
