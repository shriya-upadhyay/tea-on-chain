import { Schema, model, models } from "mongoose";

const menProfileSchema = new Schema({
  uuid: { type: String, required: true, unique: true }, // PK, maps to MenPhoto.uuid
  firstName: String,
  lastName: String,
  instagram: String,
  linkedin: String,
  facebook: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  checks: [{ type: Schema.Types.ObjectId, ref: "Check" }]
});

// Use models.MenProfile if it exists, otherwise create new model
const MenProfile = models.MenProfile || model("MenProfile", menProfileSchema);
export default MenProfile;
