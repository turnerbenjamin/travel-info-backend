import { Schema, model } from "mongoose";
const { isEmail } = require("validator");

const userSchema = new Schema({
  emailAddress: {
    type: String,
    required: [true, "Field required: email"],
    validate: [isEmail, "Invalid email address"],
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

const User = model("User", userSchema);
export default User;
