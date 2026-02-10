import mongoose from "mongoose";

const programSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  host: { type: String, required: true },
  location: { type: String, required: true },
  
  // Time information
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  
  // Recurrence pattern
  recurrenceType: { 
    type: String, 
    required: true,
    enum: ['weekly', 'bi-weekly', 'monthly', 'custom'],
    default: 'weekly'
  },
  
  // For weekly and bi-weekly: day of week (0=Sunday, 1=Monday, etc.)
  dayOfWeek: { type: Number, min: 0, max: 6 },
  
  // For bi-weekly: which week (1st, 3rd or 2nd, 4th)
  weekPattern: { type: String, enum: ['1,3', '2,4', 'all'], default: 'all' },
  
  // For monthly: day of month (1-31)
  dayOfMonth: { type: Number, min: 1, max: 31 },
  
  // Program status
  isActive: { type: Boolean, default: true },
  
  // Optional extras
  category: { type: String },
  capacity: { type: Number, default: 0 }, // 0 means unlimited
  currentAttendees: { type: Number, default: 0 },
  imageUrl: { type: String },
  registrationLink: { type: String },
  price: { type: Number, default: 0 },
  
  // Additional info
  notes: { type: String },
  contactInfo: { type: String },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Account" }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Helper method to get the next occurrence date
programSchema.methods.getNextOccurrence = function() {
  const now = new Date();
  const currentDay = now.getDay();
  const currentDate = now.getDate();
  
  if (this.recurrenceType === 'weekly') {
    // Calculate days until next occurrence
    let daysUntil = this.dayOfWeek - currentDay;
    if (daysUntil <= 0) {
      daysUntil += 7; // Next week
    }
    
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + daysUntil);
    return nextDate;
  } else if (this.recurrenceType === 'bi-weekly') {
    // Calculate next bi-weekly occurrence
    let daysUntil = this.dayOfWeek - currentDay;
    if (daysUntil <= 0) {
      daysUntil += 7;
    }
    
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + daysUntil);
    
    // Check if it matches the week pattern
    const weekOfMonth = Math.ceil(nextDate.getDate() / 7);
    const pattern = this.weekPattern.split(',').map(Number);
    
    if (!pattern.includes(weekOfMonth)) {
      // Move to next valid week
      nextDate.setDate(nextDate.getDate() + 7);
    }
    
    return nextDate;
  } else if (this.recurrenceType === 'monthly') {
    // Next occurrence on the specified day of month
    const nextDate = new Date(now.getFullYear(), now.getMonth(), this.dayOfMonth);
    
    if (nextDate <= now) {
      // Move to next month
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
    
    return nextDate;
  }
  
  return null;
};

// Helper method to format recurrence text
programSchema.methods.getRecurrenceText = function() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  if (this.recurrenceType === 'weekly') {
    return `Every ${days[this.dayOfWeek]}`;
  } else if (this.recurrenceType === 'bi-weekly') {
    const weekText = this.weekPattern === '1,3' ? '1st & 3rd' : '2nd & 4th';
    return `${weekText} ${days[this.dayOfWeek]} of every month`;
  } else if (this.recurrenceType === 'monthly') {
    return `Every month on the ${this.dayOfMonth}${this.getOrdinalSuffix(this.dayOfMonth)}`;
  }
  
  return 'Custom schedule';
};

programSchema.methods.getOrdinalSuffix = function(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

export default mongoose.models.Program || mongoose.model("Program", programSchema);
