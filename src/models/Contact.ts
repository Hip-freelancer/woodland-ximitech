import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  status: "new" | "read" | "replied";
  submittedAt: Date;
}

const ContactSchema = new Schema<IContact>({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ["new", "read", "replied"], default: "new" },
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Contact ||
  mongoose.model<IContact>("Contact", ContactSchema);
