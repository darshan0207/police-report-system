import mongoose, { Schema, type Document } from "mongoose"

export interface IDailySummary extends Document {
  date: Date
  totalAvailable: number
  totalOnDuty: number
  lawOrderDuty: number
  vipDuty: number
  railwayDuty: number
  trafficDuty: number
  otherDuty: number
  courtDuty: number
  onLeave: number
  remarks?: string
  createdAt: Date
  updatedAt: Date
}

const DailySummarySchema = new Schema<IDailySummary>(
  {
    date: { type: Date, required: true, unique: true },
    totalAvailable: { type: Number, default: 0 },
    totalOnDuty: { type: Number, default: 0 },
    lawOrderDuty: { type: Number, default: 0 },
    vipDuty: { type: Number, default: 0 },
    railwayDuty: { type: Number, default: 0 },
    trafficDuty: { type: Number, default: 0 },
    otherDuty: { type: Number, default: 0 },
    courtDuty: { type: Number, default: 0 },
    onLeave: { type: Number, default: 0 },
    remarks: { type: String },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.DailySummary || mongoose.model<IDailySummary>("DailySummary", DailySummarySchema)
