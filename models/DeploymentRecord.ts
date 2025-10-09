import mongoose, { Query, Schema, type Document, type Types } from "mongoose";

export interface IDeploymentRecord extends Document {
  date: Date;
  unit: Types.ObjectId;
  policeStation: Types.ObjectId;
  arrangement: Types.ObjectId;
  dutyType: Types.ObjectId;
  verifyingOfficer: Types.ObjectId;
  dutyCount: number;
  remarks?: string;
  images: string[];
  otherImage: string | "";
  createdAt: Date;
  updatedAt: Date;
}

const DeploymentRecordSchema = new Schema<IDeploymentRecord>(
  {
    date: { type: Date, required: true },
    unit: { type: Schema.Types.ObjectId, ref: "Unit", required: true },
    policeStation: {
      type: Schema.Types.ObjectId,
      ref: "PoliceStation",
      required: true,
    },
    arrangement: {
      type: Schema.Types.ObjectId,
      ref: "Arrangement",
    },
    dutyType: {
      type: Schema.Types.ObjectId,
      ref: "DutyType",
      required: true,
    },
    verifyingOfficer: {
      type: Schema.Types.ObjectId,
      ref: "Officer",
      required: true,
    },
    dutyCount: { type: Number, default: 0 },
    images: [{ type: String }],
    remarks: { type: String },
    otherImage: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.DeploymentRecord ||
  mongoose.model<IDeploymentRecord>("DeploymentRecord", DeploymentRecordSchema);
