import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  emailAddress: {
    type: String,
    required: [true, "Field required: email"],
    validate: [validator.isEmail, "Invalid email address"],
  },
  password: {
    type: String,
    required: [true, "Field required: password"],
    minLength: 8,
  },
  FavouriteLocations: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Location",
    default: [],
  },
});

const User = mongoose.model("User", userSchema);
export default User;
