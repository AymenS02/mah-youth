import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Account" }
}, { timestamps: true });

export default mongoose.models.Article || mongoose.model("Article", articleSchema);
