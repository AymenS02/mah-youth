import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  event: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Event", 
    required: true 
  },
  fullName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    lowercase: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  dietaryRestrictions: { 
    type: String, 
    default: "" 
  },
  emergencyContact: { 
    type: String, 
    default: "" 
  },
  emergencyPhone: { 
    type: String, 
    default: "" 
  },
  additionalNotes: { 
    type: String, 
    default: "" 
  },
  status: { 
    type: String, 
    enum: ['confirmed', 'cancelled', 'waitlist'], 
    default: 'confirmed' 
  },
  registeredAt: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to prevent duplicate registrations
registrationSchema.index({ event: 1, email: 1 }, { unique: true });

export default mongoose.models.Registration || mongoose.model("Registration", registrationSchema);
