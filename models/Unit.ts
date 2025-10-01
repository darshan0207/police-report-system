import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface IUnit extends Document {
  name: string;
  type?: string;
  contactPerson?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UnitSchema = new Schema<IUnit>(
  {
    name: { type: String, required: true },
    type: { type: String },
    contactPerson: { type: String },
    phone: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Unit ||
  mongoose.model<IUnit>("Unit", UnitSchema);
