import mongoose from "mongoose";

const execPositionApplicationSchema = new mongoose.Schema({
  position: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "ExecPosition",
    required: true
  },
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
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
  // Store answers to custom questions
  questionAnswers: [{
    questionId: { type: String, required: true },
    questionText: { type: String, required: true },
    questionType: { type: String },
    answer: { type: mongoose.Schema.Types.Mixed } // Can be string, array, etc.
  }],
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  appliedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true 
});

// Index to prevent duplicate applications for the same position
execPositionApplicationSchema.index({ position: 1, email: 1 }, { unique: true });

export default mongoose.models.ExecPositionApplication || mongoose.model("ExecPositionApplication", execPositionApplicationSchema);
