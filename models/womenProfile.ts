const { Schema, model } = require("mongoose");

const womenProfileSchema = new Schema({
  uuid: { type: String, required: true, unique: true }, // PK
  fernid: String,
  username: { type: String, required: true, unique: true },
  walletAddress: String,
  staked: { type: Boolean, default: false },
  reported: [{ type: String }], // store MenAccount.uuid they reported
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  reports: { type: Number, default: 0 },
});

const WomenProfile = model("WomenProfile", womenProfileSchema);
export default WomenProfile;
