import mongoose, { Document, Query } from "mongoose";

interface OfficerDocument extends Document {
  name: string;
  badgeNumber: string;
  rank: string;
  photo?: string | null;
  zone: mongoose.Types.ObjectId;
  unit?: mongoose.Types.ObjectId | null;
  policeStation?: mongoose.Types.ObjectId | null;
  contactNumber?: string;
  email?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OfficerSchema = new mongoose.Schema<OfficerDocument>(
  {
    name: { type: String, required: true, trim: true },
    badgeNumber: { type: String, required: true, unique: true, trim: true },
    rank: { type: String, required: true, trim: true },
    photo: { type: String, default: null },
    zone: { type: mongoose.Schema.Types.ObjectId, ref: "Zone", required: true },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", default: null },
    policeStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PoliceStation",
      default: null,
    },
    contactNumber: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Tell TS that `this` is a mongoose.Query so we can call .populate()
OfficerSchema.pre(/^find/, function (this: Query<any, OfficerDocument>, next) {
  this.populate("zone", "name")
    .populate("unit", "name")
    .populate("policeStation", "name");
  next();
});

export default mongoose.models.Officer ||
  mongoose.model<OfficerDocument>("Officer", OfficerSchema);
