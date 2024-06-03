import mongoose from "mongoose";

const favouritedLocationSchema = new mongoose.Schema({
  user: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    required: true,
  },
  location: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Location",
    required: true,
  },
});

const FavouritedLocation = mongoose.model(
  "FavouritedLocation",
  favouritedLocationSchema
);
export default FavouritedLocation;
