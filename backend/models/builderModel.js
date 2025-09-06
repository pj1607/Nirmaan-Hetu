import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Past Work Schema
const pastWorkSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }],
  price: { type: String },
  specialties: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

// Portfolio Schema
const portfolioSchema = new Schema(
  {
   logo: {
  url: { type: String },
  public_id: { type: String }
}
,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    experience: {
       type: String,
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
     location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    description: {
      type: String,
      default: "",
    },
    pastWorks: {
      type: [pastWorkSchema],
      default: [],
    },
  },
  { timestamps: true }
);

portfolioSchema.index({ location: "2dsphere" });
const Portfolio = model("Portfolio", portfolioSchema);

export default Portfolio;
