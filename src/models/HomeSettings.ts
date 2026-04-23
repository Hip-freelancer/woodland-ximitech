import mongoose, { Document, Schema } from "mongoose";

const LocalizedTextSchema = new Schema(
  {
    en: { type: String, default: "" },
    vi: { type: String, default: "" },
  },
  { _id: false }
);

const HomeHeroSlideSchema = new Schema(
  {
    alt: { type: LocalizedTextSchema, default: () => ({ en: "", vi: "" }) },
    isVisible: { type: Boolean, default: true },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    mediaUrl: { type: String, required: true },
    order: { type: Number, default: 0 },
    posterUrl: { type: String, default: "" },
  },
  { _id: true }
);

const HomeHeroStatSchema = new Schema(
  {
    isVisible: { type: Boolean, default: true },
    label: { type: LocalizedTextSchema, default: () => ({ en: "", vi: "" }) },
    order: { type: Number, default: 0 },
    value: { type: LocalizedTextSchema, default: () => ({ en: "", vi: "" }) },
  },
  { _id: true }
);

export interface IHomeSettings extends Document {
  contactEmail: string;
  contactPhone: string;
  heroSlides: Array<{
    alt: { en: string; vi: string };
    isVisible: boolean;
    mediaType: "image" | "video";
    mediaUrl: string;
    order: number;
    posterUrl?: string;
  }>;
  heroStats: Array<{
    isVisible: boolean;
    label: { en: string; vi: string };
    order: number;
    value: { en: string; vi: string };
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const HomeSettingsSchema = new Schema<IHomeSettings>(
  {
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    heroSlides: { type: [HomeHeroSlideSchema], default: [] },
    heroStats: { type: [HomeHeroStatSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.HomeSettings ||
  mongoose.model<IHomeSettings>("HomeSettings", HomeSettingsSchema);
