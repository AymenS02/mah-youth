import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/config/db';
import YouthCommitteeApplication from '../../../../../lib/models/YouthCommitteeApplicationModel';

// PATCH - Update youth committee application status (approve/reject)
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status (pending, approved, rejected) is required' },
        { status: 400 }
      );
    }

    const application = await YouthCommitteeApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application
    });

  } catch (error) {
    console.error('❌ Update youth committee application error:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}
