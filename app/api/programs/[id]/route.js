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
