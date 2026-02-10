import { NextResponse } from "next/server";
import connectDB from "/lib/config/db";
import Program from "/lib/models/ProgramModel";

// GET - Fetch all programs
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const isActiveOnly = searchParams.get('active') === 'true';
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    // Build query
    let query = {};
    
    if (isActiveOnly) {
      query.isActive = true;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { host: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const programs = await Program.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');

    return NextResponse.json({
      success: true,
      programs,
      count: programs.length
    });
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch programs" },
      { status: 500 }
    );
  }
}

// POST - Create a new program
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'host', 'location', 'startTime', 'endTime', 'recurrenceType'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate recurrence-specific fields
    if (body.recurrenceType === 'weekly' || body.recurrenceType === 'bi-weekly') {
      if (body.dayOfWeek === undefined || body.dayOfWeek === null) {
        return NextResponse.json(
          { success: false, error: 'Day of week is required for weekly/bi-weekly programs' },
          { status: 400 }
        );
      }
    }
    
    if (body.recurrenceType === 'monthly') {
      if (!body.dayOfMonth) {
        return NextResponse.json(
          { success: false, error: 'Day of month is required for monthly programs' },
          { status: 400 }
        );
      }
    }

    // Check for duplicates (including inactive programs to prevent title reuse)
    const existingProgram = await Program.findOne({
      title: body.title
    });

    if (existingProgram) {
      return NextResponse.json(
        { success: false, error: "A program with this title already exists. Please choose a different title." },
        { status: 409 }
      );
    }

    const program = await Program.create(body);

    return NextResponse.json({
      success: true,
      program,
      message: "Program created successfully"
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating program:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create program" },
      { status: 500 }
    );
  }
}
