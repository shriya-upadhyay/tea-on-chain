import { Schema, model } from "mongoose";

const backgroundCheckSchema = new Schema({
  maritalStatus: {
    status: String,
    link: String
  },
  criminalRecord: {
    status: String,
    link: String
  }
});

const BackgroundCheck = model("BackgroundCheck", backgroundCheckSchema);
export default BackgroundCheck;
