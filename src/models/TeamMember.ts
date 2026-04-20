import mongoose, { Schema, Document } from "mongoose";

export interface ITeamMember extends Document {
  name: string;
  title: string;
  region: string;
  image: string;
  email: string;
  phone: string;
  whatsapp: string;
  zalo: string;
  order: number;
}

const TeamMemberSchema = new Schema<ITeamMember>({
  name: { type: String, required: true },
  title: { type: String, required: true },
  region: { type: String, required: true },
  image: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  whatsapp: { type: String },
  zalo: { type: String },
  order: { type: Number, default: 0 },
});

export default mongoose.models.TeamMember ||
  mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);
