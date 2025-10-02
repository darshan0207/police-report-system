import mongoose, { Document, Query } from "mongoose";

interface OfficerDocument extends Document {
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OfficerSchema = new mongoose.Schema<OfficerDocument>(
  {
    name: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Officer ||
  mongoose.model<OfficerDocument>("Officer", OfficerSchema);
