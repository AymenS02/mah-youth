// app/api/books/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/config/db';
import Book from '../../../lib/models/BookModel';
import Account from '../../../lib/models/AccountModel';

// GET - Fetch all books
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Build search query
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }

    // Fetch books with pagination and populate createdBy
    const books = await Book.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Book.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Get books error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

// POST - Create new book
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      title,
      author,
      category,
      pages,
      description,
      publishYear,
      language,
      size,
      coverUrl,
      downloadUrl,
      createdBy
    } = body;

    // Validation
    if (!title || !author || !category || !pages || !description || !publishYear || !language || !size || !downloadUrl) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Validate that createdBy user exists
    if (createdBy) {
      const user = await Account.findById(createdBy);
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid user ID' },
          { status: 400 }
        );
      }
    }

    // Check if book with same title and author already exists
    const existingBook = await Book.findOne({ 
      title: { $regex: new RegExp(`^${title}$`, 'i') }, 
      author: { $regex: new RegExp(`^${author}$`, 'i') }
    });
    
    if (existingBook) {
      return NextResponse.json(
        { error: 'A book with this title and author already exists' },
        { status: 409 }
      );
    }

    // Create new book
    const newBook = new Book({
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      pages: parseInt(pages),
      description: description.trim(),
      publishYear: parseInt(publishYear),
      language: language.trim(),
      size: size.trim(),
      coverUrl: coverUrl?.trim() || null,
      downloadUrl: downloadUrl.trim(),
      createdBy: createdBy || null
    });

    const savedBook = await newBook.save();
    
    // Populate the createdBy field for response
    await savedBook.populate('createdBy', 'name email');

    console.log('✅ Book created successfully:', savedBook._id);

    return NextResponse.json({
      success: true,
      message: 'Book created successfully',
      book: savedBook
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Create book error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    );
  }
}

// PUT - Update book (handled in individual book route)
export async function PUT() {
  return NextResponse.json(
    { error: 'Use /api/books/[id] for updating specific books' },
    { status: 405 }
  );
}

// DELETE - Delete multiple books (handled in individual book route for single delete)
export async function DELETE() {
  return NextResponse.json(
    { error: 'Use /api/books/[id] for deleting specific books' },
    { status: 405 }
  );
}