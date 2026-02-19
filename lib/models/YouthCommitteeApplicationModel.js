import mongoose from "mongoose";

const youthCommitteeApplicationSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  age: {
    type: Number,
    required: true,
    min: [1, 'Age must be at least 1'],
    max: [120, 'Age cannot exceed 120']
  },
  phone: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    lowercase: true 
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Non-binary', 'Prefer not to say', 'Other']
  },
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

// Index to prevent duplicate applications
youthCommitteeApplicationSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.YouthCommitteeApplication || mongoose.model("YouthCommitteeApplication", youthCommitteeApplicationSchema);
