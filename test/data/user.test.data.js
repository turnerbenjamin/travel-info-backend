import mongoose from "mongoose";

const userData = {
  documents: [
    {
      _id: new mongoose.Types.ObjectId(),
      emailAddress: "user0@test.com",
      password: "00000000",
      FavouriteLocations: [],
    },
    {
      _id: new mongoose.Types.ObjectId(),
      emailAddress: "user1@test.com",
      password: "00000001",
      FavouriteLocations: [],
    },
  ],
};

export default userData;
