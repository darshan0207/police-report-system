import mongoose, { Schema, type Document } from "mongoose";

export interface IDutyType extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const DutyTypeSchema = new Schema<IDutyType>(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.DutyType ||
  mongoose.model<IDutyType>("DutyType", DutyTypeSchema);
