import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../lib/config/db';
import Account from '../../../lib/models/AccountModel';

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { name, email, phone, password, confirmPassword, passcode } = body;
    
    // Mandatory passcode validation for ALL registrations
    const CORRECT_PASSCODE = process.env.REGISTRATION_PASSCODE;
    
    if (!passcode) {
      return NextResponse.json(
        { error: 'Registration passcode is required' },
        { status: 400 }
      );
    }
    
    if (passcode !== CORRECT_PASSCODE) {
      return NextResponse.json(
        { error: 'Invalid registration passcode' },
        { status: 401 }
      );
    }
    
    // Continue with regular validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectDB();
    
    // Check if user already exists
    const existingUser = await Account.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new account
    const newAccount = new Account({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      completed: false
    });
    
    // Save to database
    const savedAccount = await newAccount.save();
    
    console.log('✅ Account created successfully:', savedAccount._id);
    
    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: {
          id: savedAccount._id,
          name: savedAccount.name,
          email: savedAccount.email,
          phone: savedAccount.phone,
          completed: savedAccount.completed,
          createdAt: savedAccount.createdAt
        }
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// Handle unsupported HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}