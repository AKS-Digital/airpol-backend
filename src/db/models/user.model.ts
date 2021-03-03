import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true },
});

export const User = mongoose.model<IUser>("User", UserSchema);
