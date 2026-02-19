import mongoose from "mongoose";

const volunteerHoursApplicationSchema = new mongoose.Schema({
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
  highSchool: {
    type: String,
    required: true
  },
  parentFirstName: {
    type: String,
    required: true
  },
  parentLastName: {
    type: String,
    required: true
  },
  parentPhone: {
    type: String,
    required: true
  },
  parentEmail: {
    type: String,
    required: true,
    lowercase: true
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
volunteerHoursApplicationSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.VolunteerHoursApplication || mongoose.model("VolunteerHoursApplication", volunteerHoursApplicationSchema);
