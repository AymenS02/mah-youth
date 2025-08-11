// app/api/books/[id]/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/config/db';
import Book from '../../../../lib/models/BookModel';
import Account from '../../../../lib/models/AccountModel';

// GET - Fetch single book
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    const book = await Book.findById(id).populate('createdBy', 'name email');
    
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      book
    });

  } catch (error) {
    console.error('❌ Get book error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}

// PUT - Update book
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

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
      downloadUrl
    } = body;

    // Validation
    if (!title || !author || !category || !pages || !description || !publishYear || !language || !size || !downloadUrl) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Check if book exists
    const existingBook = await Book.findById(id);
    if (!existingBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    // Check if another book with same title and author exists (excluding current book)
    const duplicateBook = await Book.findOne({ 
      _id: { $ne: id },
      title: { $regex: new RegExp(`^${title}$`, 'i') }, 
      author: { $regex: new RegExp(`^${author}$`, 'i') }
    });
    
    if (duplicateBook) {
      return NextResponse.json(
        { error: 'A book with this title and author already exists' },
        { status: 409 }
      );
    }

    // Update book
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        pages: parseInt(pages),
        description: description.trim(),
        publishYear: parseInt(publishYear),
        language: language.trim(),
        size: size.trim(),
        coverUrl: coverUrl?.trim() || null,
        downloadUrl: downloadUrl.trim()
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    console.log('✅ Book updated successfully:', updatedBook._id);

    return NextResponse.json({
      success: true,
      message: 'Book updated successfully',
      book: updatedBook
    });

  } catch (error) {
    console.error('❌ Update book error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

// DELETE - Delete book
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    // Check if book exists
    const book = await Book.findById(id);
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    // Delete the book
    await Book.findByIdAndDelete(id);

    console.log('✅ Book deleted successfully:', id);

    return NextResponse.json({
      success: true,
      message: 'Book deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete book error:', error);
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    );
  }
}