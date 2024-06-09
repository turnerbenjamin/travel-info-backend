import { Schema, model } from "mongoose";
import validator from "validator";

const userSchema = new Schema({
  emailAddress: {
    type: String,
    required: [true, "Field required: email"],
    validate: [validator.isEmail, "Invalid email address"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Field required: password"],
    minLength: 8,
  },
});

const User = model("User", userSchema);
export default User;
