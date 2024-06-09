import mongoose from "mongoose";

const userData = {
  documents: [
    {
      _id: new mongoose.Types.ObjectId(),
      emailAddress: "user0@test.com",
      password: "00000000",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      emailAddress: "user1@test.com",
      password: "00000001",
    },
  ],
  submissions: [
    {
      emailAddress: "user0@test.com",
      password: "password1",
    },
    {
      emailAddress: "user1@test.com",
      password: "password2",
    },
  ],
};

export default userData;
