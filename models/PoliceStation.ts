import mongoose, { Schema, type Document, type Types } from "mongoose"

export interface IPoliceStation extends Document {
  name: string
  zone: Types.ObjectId
  unit?: Types.ObjectId
  address?: string
  city?: string
  contactNumber?: string
  createdAt: Date
  updatedAt: Date
}

const PoliceStationSchema = new Schema<IPoliceStation>(
  {
    name: { type: String, required: true },
    zone: { type: Schema.Types.ObjectId, ref: "Zone", required: true },
    unit: { type: Schema.Types.ObjectId, ref: "Unit" },
    address: { type: String },
    city: { type: String },
    contactNumber: { type: String },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.PoliceStation || mongoose.model<IPoliceStation>("PoliceStation", PoliceStationSchema)
