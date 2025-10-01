import mongoose, { Query, Schema, type Document, type Types } from "mongoose";

export interface IDeploymentRecord extends Document {
  date: Date;
  unit: Types.ObjectId;
  policeStation: Types.ObjectId;
  dayDutyMale: number;
  dayDutyFemale: number;
  nightDutyMale: number;
  nightDutyFemale: number;
  totalPhotos: number;
  verifyingOfficer: Types.ObjectId;
  remarks?: string;
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
    dayDutyMale: { type: Number, default: 0 },
    dayDutyFemale: { type: Number, default: 0 },
    nightDutyMale: { type: Number, default: 0 },
    nightDutyFemale: { type: Number, default: 0 },
    totalPhotos: { type: Number, default: 0 },
    verifyingOfficer: {
      type: Schema.Types.ObjectId,
      ref: "Officer",
      required: true,
    },
    remarks: { type: String },
  },
  {
    timestamps: true,
  }
);

// DeploymentRecordSchema.pre(
//   /^find/,
//   function (this: Query<any, IDeploymentRecord>, next) {
//     this.populate("zone", "name")
//       .populate("unit", "name")
//       .populate("policeStation", "name")
//       .populate("verifyingOfficer", "name badgeNumber rank photo");
//     next();
//   }
// );

export default mongoose.models.DeploymentRecord ||
  mongoose.model<IDeploymentRecord>("DeploymentRecord", DeploymentRecordSchema);
