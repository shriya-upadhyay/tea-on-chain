import { Schema, model } from "mongoose";

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

const MenProfile = model("MenProfile", menProfileSchema);
export default MenProfile;
