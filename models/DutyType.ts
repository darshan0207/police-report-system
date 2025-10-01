import mongoose, { Schema, type Document } from "mongoose";

export interface IDutyType extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DutyTypeSchema = new Schema<IDutyType>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.DutyType ||
  mongoose.model<IDutyType>("DutyType", DutyTypeSchema);
