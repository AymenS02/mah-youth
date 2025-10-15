import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Brothers Retreat 2025"
  description: { type: String, required: true }, // e.g., "A weekend of reflection, bonding, and learning."
  location: { type: String, required: true }, // e.g., "Toronto, ON"
  date: { type: Date, required: true }, // e.g., "2025-07-12"
  startTime: { type: String, required: true }, // e.g., "09:00 AM"
  endTime: { type: String, required: true }, // e.g., "05:00 PM"
  category: { type: String, required: true }, // e.g., "Retreat", "Seminar", "Fundraiser"
  capacity: { type: Number, default: 0 }, // e.g., 100
  imageUrl: { type: String }, // e.g., "/images/retreat-banner.jpg"
  registrationLink: { type: String }, // e.g., "https://macmsa.ca/register"
  
  // optional extras
  isOnline: { type: Boolean, default: false },
  speakers: [{ type: String }], // e.g., ["Imam Abdullah", "Ustadh Hamza"]
  price: { type: Number, default: 0 }, // e.g., 20 (CAD)
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Account" } // user who created the event
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model("Event", eventSchema);
