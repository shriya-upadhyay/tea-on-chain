import { Schema, model, models } from "mongoose";

const reviewSchema = new Schema({
  uuid: { type: String, required: true, unique: true },
  review: { type: String, required: true },
  woman: { type: String, ref: "WomenAccount", required: true }, 
  man: { type: String, ref: "MenAccount", required: true }      
});

// Use models.Review if it exists, otherwise create new model
const Review = models.Review || model("Review", reviewSchema);
export default Review;
