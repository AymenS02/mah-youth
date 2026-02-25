import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/config/db';
import Email from '../../../lib/models/EmailModel';

export async function POST(request) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await Email.findOne({ email });

    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: 'Email already subscribed' },
        { status: 409 }
      );
    }

    // Save new email
    const newSubscriber = await Email.create({ email });

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter',
        email: newSubscriber.email,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ Newsletter error:', error);

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}