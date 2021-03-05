import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  birthdate: Date;
  gender: "male" | "female";
  createdAt: Date;
  emailVerified: boolean;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  birthdate: { type: Date },
  gender: { type: String },
  createdAt: { type: Date, default: new Date() },
  emailVerified: { type: Boolean, default: false },
});

export const User = mongoose.model<IUser>("User", UserSchema);
