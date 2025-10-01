import mongoose, { Document, Query } from "mongoose";

interface OfficerDocument extends Document {
  name: string;
  badgeNumber: string;
  rank: string;
  photo?: string | null;
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
  this.populate("name")
    .populate("unit", "name")
    .populate("policeStation", "name");
  next();
});

export default mongoose.models.Officer ||
  mongoose.model<OfficerDocument>("Officer", OfficerSchema);
