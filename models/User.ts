import mongoose, { Schema, type Document, type Types } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  email: string
  passwordHash: string
  name: string
  role: "admin" | "zone" | "unit"
  zone?: Types.ObjectId
  unit?: Types.ObjectId
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  comparePassword(candidate: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["admin", "zone", "unit"], required: true },
    zone: { type: Schema.Types.ObjectId, ref: "Zone" },
    unit: { type: Schema.Types.ObjectId, ref: "Unit" },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
)

UserSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.passwordHash)
}

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
