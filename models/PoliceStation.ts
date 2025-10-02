import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface IPoliceStation extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const PoliceStationSchema = new Schema<IPoliceStation>(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PoliceStation ||
  mongoose.model<IPoliceStation>("PoliceStation", PoliceStationSchema);
