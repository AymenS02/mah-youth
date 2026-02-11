import { NextResponse } from "next/server";
import connectDB from "/lib/config/db";
import Program from "/lib/models/ProgramModel";
import mongoose from "mongoose";

// GET - Fetch a single program by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid program ID" },
        { status: 400 }
      );
    }

    const program = await Program.findById(id).populate('createdBy', 'name email');

    if (!program) {
      return NextResponse.json(
        { success: false, error: "Program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      program
    });
  } catch (error) {
    console.error("Error fetching program:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch program" },
      { status: 500 }
    );
  }
}

// PUT - Update a program
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid program ID" },
        { status: 400 }
      );
    }

    // Don't allow changing certain fields
    delete body._id;
    delete body.createdAt;
    delete body.updatedAt;

    // Process registration questions if provided
    if (body.registrationQuestions !== undefined) {
      if (Array.isArray(body.registrationQuestions)) {
        body.registrationQuestions = body.registrationQuestions
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
    }

    const program = await Program.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!program) {
      return NextResponse.json(
        { success: false, error: "Program not found" },
        { status: 404 }
      );
    }

    console.log('✅ Program updated successfully:', program._id);
    if (body.registrationQuestions !== undefined) {
      console.log('📝 Registration questions updated:', body.registrationQuestions.length);
    }

    return NextResponse.json({
      success: true,
      program,
      message: "Program updated successfully"
    });
  } catch (error) {
    console.error("Error updating program:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update program" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a program (soft delete by setting isActive to false)
// Note: This is a soft delete operation. The program remains in the database
// but is marked as inactive and won't appear in active program listings.
// This preserves data history and prevents accidental data loss.
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid program ID" },
        { status: 400 }
      );
    }

    // Soft delete by setting isActive to false
    const program = await Program.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    );

    if (!program) {
      return NextResponse.json(
        { success: false, error: "Program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Program deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting program:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete program" },
      { status: 500 }
    );
  }
}
