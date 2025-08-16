import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
  uuid: { type: String, required: true, unique: true },
  review: { type: String, required: true },
  woman: { type: String, ref: "WomenAccount", required: true }, // Woman uuid
  man: { type: String, ref: "MenAccount", required: true }      // Man uuid
});

const Review = model("Review", reviewSchema);
module.exports = Review;
