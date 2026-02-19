import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/config/db';
import VolunteerHoursApplication from '../../../../lib/models/VolunteerHoursApplicationModel';

// GET - Fetch all volunteer hours applications
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = {};
    if (status) {
      query.status = status;
    }

    const applications = await VolunteerHoursApplication.find(query)
      .sort({ appliedAt: -1 });

    return NextResponse.json({
      success: true,
      applications,
      count: applications.length
    });

  } catch (error) {
    console.error('❌ Get volunteer hours applications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch volunteer hours applications' },
      { status: 500 }
    );
  }
}

// POST - Create new volunteer hours application
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
      gender,
      highSchool,
      parentFirstName,
      parentLastName,
      parentPhone,
      parentEmail
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !age || !phone || !email || !gender || 
        !highSchool || !parentFirstName || !parentLastName || !parentPhone || !parentEmail) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if application already exists
    const existingApplication = await VolunteerHoursApplication.findOne({ email: email.toLowerCase() });
    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already submitted an application with this email' },
        { status: 409 }
      );
    }

    const newApplication = new VolunteerHoursApplication({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age: parseInt(age),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      gender,
      highSchool: highSchool.trim(),
      parentFirstName: parentFirstName.trim(),
      parentLastName: parentLastName.trim(),
      parentPhone: parentPhone.trim(),
      parentEmail: parentEmail.trim().toLowerCase(),
      status: 'pending'
    });

    const savedApplication = await newApplication.save();

    console.log('✅ Volunteer hours application created successfully:', savedApplication._id);

    return NextResponse.json({
      success: true,
      message: 'Volunteer hours application submitted successfully',
      application: savedApplication
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Create volunteer hours application error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit volunteer hours application' },
      { status: 500 }
    );
  }
}
