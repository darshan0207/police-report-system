import mongoose, { Schema, type Document } from "mongoose"

export interface IZone extends Document {
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const ZoneSchema = new Schema<IZone>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Zone || mongoose.model<IZone>("Zone", ZoneSchema)
