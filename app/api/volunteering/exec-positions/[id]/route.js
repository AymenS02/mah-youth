import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/config/db';
import ExecPosition from '../../../../../lib/models/ExecPositionModel';

// GET - Fetch single exec position
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const position = await ExecPosition.findById(id)
      .populate('createdBy', 'name email');

    if (!position) {
      return NextResponse.json(
        { error: 'Exec position not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      position
    });

  } catch (error) {
    console.error('❌ Get exec position error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exec position' },
      { status: 500 }
    );
  }
}

// PUT - Update exec position
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();
    
    const position = await ExecPosition.findById(id);
    if (!position) {
      return NextResponse.json(
        { error: 'Exec position not found' },
        { status: 404 }
      );
    }

    const { title, description, questions, isActive } = body;

    // Process questions if provided
    let processedQuestions = position.questions;
    if (questions !== undefined && Array.isArray(questions)) {
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

    // Update fields
    if (title) position.title = title.trim();
    if (description) position.description = description.trim();
    if (questions !== undefined) position.questions = processedQuestions;
    if (isActive !== undefined) position.isActive = Boolean(isActive);

    const updatedPosition = await position.save();
    await updatedPosition.populate('createdBy', 'name email');

    console.log('✅ Exec position updated successfully:', updatedPosition._id);

    return NextResponse.json({
      success: true,
      message: 'Exec position updated successfully',
      position: updatedPosition
    });

  } catch (error) {
    console.error('❌ Update exec position error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update exec position' },
      { status: 500 }
    );
  }
}

// DELETE - Delete exec position
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const position = await ExecPosition.findById(id);
    if (!position) {
      return NextResponse.json(
        { error: 'Exec position not found' },
        { status: 404 }
      );
    }

    await ExecPosition.findByIdAndDelete(id);

    console.log('✅ Exec position deleted successfully:', id);

    return NextResponse.json({
      success: true,
      message: 'Exec position deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete exec position error:', error);
    return NextResponse.json(
      { error: 'Failed to delete exec position' },
      { status: 500 }
    );
  }
}
