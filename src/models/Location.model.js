import { Schema, model } from "mongoose";

const locationSchema = new Schema({
  label: {
    type: String,
    required: [true, "Field required: label"],
  },
  latAndLong: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  coordinateIdentifier: {
    type: String,
    required: true,
    unique: true,
  },
});

const Location = model("Location", locationSchema);
export default Location;
