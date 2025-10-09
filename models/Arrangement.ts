import mongoose, { Document, Query } from "mongoose";

interface ArrangementDocument extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const ArrangementSchema = new mongoose.Schema<ArrangementDocument>(
  {
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.Arrangement ||
  mongoose.model<ArrangementDocument>("Arrangement", ArrangementSchema);
