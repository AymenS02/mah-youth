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
    enum: ['weekly', 'bi-weekly', 'monthly'],
    default: 'weekly'
  },
  
  // For weekly and bi-weekly: day of week (0=Sunday, 1=Monday, etc.)
  dayOfWeek: { type: Number, min: 0, max: 6 },
  
  // For bi-weekly: which weeks of the month (1-2 or 3-4)
  weekPattern: { type: String, enum: ['1,2', '3,4', 'all'], default: 'all' },
  
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
  
  // Registration questions
  registrationQuestions: [{
    id: { type: Number, required: true },
    text: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['text', 'textarea', 'email', 'phone', 'number', 'date', 'select', 'radio', 'checkbox'],
      default: 'text'
    },
    required: { type: Boolean, default: false },
    options: [{
      id: { type: Number },
      text: { type: String }
    }]
  }],
  
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
    
    // Determine which half of the month (weeks 1-2 or weeks 3-4)
    const dayOfMonth = nextDate.getDate();
    const isFirstHalf = dayOfMonth <= 14; // Days 1-14 are first half, 15+ are second half
    const pattern = this.weekPattern.split(',').map(Number);
    
    // If pattern is "1,2" (first half) and we're in second half, or vice versa, skip to next occurrence
    if (pattern.includes(1) && pattern.includes(2) && !isFirstHalf) {
      // Move to next month's first half
      nextDate.setMonth(nextDate.getMonth() + 1);
      nextDate.setDate(1);
      // Find the first matching day of week in next month
      const targetDay = this.dayOfWeek;
      while (nextDate.getDay() !== targetDay) {
        nextDate.setDate(nextDate.getDate() + 1);
      }
    } else if (pattern.includes(3) && pattern.includes(4) && isFirstHalf) {
      // Move to second half of same month
      nextDate.setDate(nextDate.getDate() + 14);
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
    const weekText = this.weekPattern === '1,2' ? 'First half' : 'Second half';
    return `${weekText} ${days[this.dayOfWeek]}s of every month`;
  } else if (this.recurrenceType === 'monthly') {
    return `Every month on the ${this.dayOfMonth}${this.getOrdinalSuffix(this.dayOfMonth)}`;
  }
  
  return 'Unknown schedule';
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
