import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Past Work Schema
const pastWorkSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }], // array of image URLs
  price: { type: Number },
  specialties: [{ type: String }], // e.g., "Residential", "Commercial"
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
      ref: "User", // links to the User model
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      default: "",
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

const Portfolio = model("Portfolio", portfolioSchema);

export default Portfolio;
