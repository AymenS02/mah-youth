import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  event: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Event", 
    required: false  // Make optional to support both events and programs
  },
  program: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Program", 
    required: false  // Make optional to support both events and programs
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
  age: {
    type: Number,
    required: true,
    min: [1, 'Age must be at least 1'],
    max: [120, 'Age cannot exceed 120']
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Non-binary', 'Prefer not to say', 'Other']
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
  // Store answers to custom registration questions
  questionAnswers: [{
    questionId: { type: String, required: true },
    questionText: { type: String, required: true },
    questionType: { type: String },
    answer: { type: mongoose.Schema.Types.Mixed } // Can be string, array, etc.
  }],
  status: { 
    type: String, 
    enum: ['confirmed', 'cancelled', 'waitlist'], 
    default: 'confirmed' 
  },
  checkedIn: {
    type: Boolean,
    default: false
  },
  checkedInAt: {
    type: Date
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

// Validation to ensure at least one of event or program is provided
registrationSchema.pre('validate', function(next) {
  if (!this.event && !this.program) {
    next(new Error('Either event or program must be provided'));
  } else {
    next();
  }
});

// Compound index to prevent duplicate registrations for events
registrationSchema.index({ event: 1, email: 1 }, { 
  unique: true, 
  partialFilterExpression: { event: { $type: 'objectId' } }
});

// Compound index to prevent duplicate registrations for programs  
registrationSchema.index({ program: 1, email: 1 }, { 
  unique: true, 
  partialFilterExpression: { program: { $type: 'objectId' } }
});

export default mongoose.models.Registration || mongoose.model("Registration", registrationSchema);
