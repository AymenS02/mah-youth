import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/config/db';
import YouthCommitteeApplication from '../../../../lib/models/YouthCommitteeApplicationModel';

// GET - Fetch all youth committee applications
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = {};
    if (status) {
      query.status = status;
    }

    const applications = await YouthCommitteeApplication.find(query)
      .sort({ appliedAt: -1 });

    return NextResponse.json({
      success: true,
      applications,
      count: applications.length
    });

  } catch (error) {
    console.error('❌ Get youth committee applications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch youth committee applications' },
      { status: 500 }
    );
  }
}

// POST - Create new youth committee application
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { 
      firstName,
      lastName,
      age,
      phone,
      email,
      gender
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !age || !phone || !email || !gender) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if application already exists
    const existingApplication = await YouthCommitteeApplication.findOne({ email: email.toLowerCase() });
    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already submitted an application with this email' },
        { status: 409 }
      );
    }

    const newApplication = new YouthCommitteeApplication({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age: parseInt(age),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      gender,
      status: 'pending'
    });

    const savedApplication = await newApplication.save();

    console.log('✅ Youth committee application created successfully:', savedApplication._id);

    return NextResponse.json({
      success: true,
      message: 'Youth committee application submitted successfully',
      application: savedApplication
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Create youth committee application error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit youth committee application' },
      { status: 500 }
    );
  }
}
