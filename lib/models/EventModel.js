import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  category: { type: String, required: true },
  capacity: { type: Number, default: 0 },
  imageUrl: { type: String },
  registrationLink: { type: String },
  registeredAttendees: { type: Number, default: 0 },
  registrationDeadline: { type: Date },
  
  // optional extras
  isOnline: { type: Boolean, default: false },
  speakers: [{ type: String }],
  price: { type: Number, default: 0 },
  
  // Registration questions
  registrationQuestions: [{
    id: { type: String, required: true },
    text: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['text', 'textarea', 'email', 'phone', 'number', 'date', 'select', 'radio', 'checkbox'],
      default: 'text'
    },
    required: { type: Boolean, default: false },
    options: [{
      id: { type: String },
      text: { type: String }
    }]
  }],
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Account" }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate to get all registrations for this event
eventSchema.virtual('registrations', {
  ref: 'Registration',
  localField: '_id',
  foreignField: 'event'
});

// Method to get registration count
eventSchema.methods.getRegistrationCount = async function() {
  const Registration = mongoose.model('Registration');
  return await Registration.countDocuments({ event: this._id, status: 'confirmed' });
};

// Static method to update registration count
eventSchema.statics.updateRegistrationCount = async function(eventId) {
  const Registration = mongoose.model('Registration');
  const count = await Registration.countDocuments({ event: eventId, status: 'confirmed' });
  await this.findByIdAndUpdate(eventId, { registeredAttendees: count });
  return count;
};

export default mongoose.models.Event || mongoose.model("Event", eventSchema);