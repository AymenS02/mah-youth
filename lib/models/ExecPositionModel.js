import mongoose from "mongoose";

const execPositionSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  questions: [{
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
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Account" 
  }
}, { 
  timestamps: true 
});

export default mongoose.models.ExecPosition || mongoose.model("ExecPosition", execPositionSchema);
