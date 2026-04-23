import mongoose, { Schema, Document } from "mongoose";

const LocalizedTextSchema = new Schema(
  {
    en: { type: String, default: "" },
    vi: { type: String, default: "" },
  },
  { _id: false }
);

export interface ITeamMember extends Document {
  name: {
    en: string;
    vi: string;
  };
  title: {
    en: string;
    vi: string;
  };
  region: {
    en: string;
    vi: string;
  };
  image: string;
  email: string;
  phone: string;
  whatsapp: string;
  zalo: string;
  order: number;
  isVisible: boolean;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: LocalizedTextSchema, required: true },
    title: { type: LocalizedTextSchema, required: true },
    region: { type: LocalizedTextSchema, required: true },
    image: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, default: "" },
    zalo: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.TeamMember ||
  mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);
