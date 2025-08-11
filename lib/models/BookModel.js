import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "The Fundamentals of Tawheed"
  author: { type: String, required: true }, // e.g., "Dr. Bilal Philips"
  category: { type: String, required: true }, // e.g., "Aqeedah"
  pages: { type: Number, required: true }, // e.g., 156
  description: { type: String, required: true }, // e.g., "A comprehensive guide..."
  publishYear: { type: Number, required: true }, // e.g., 2020
  language: { type: String, required: true }, // e.g., "English"
  size: { type: String, required: true }, // e.g., "2.1 MB"
  coverUrl: { type: String }, // e.g., "/images/tawheed.jpg"
  downloadUrl: { type: String, required: true }, // e.g., "/books/fundamentals-tawheed.pdf"
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Account" } // reference to the user who uploaded it
}, { timestamps: true });

export default mongoose.models.Book || mongoose.model("Book", bookSchema);
