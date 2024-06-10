import mongoose from "mongoose";

const userData = {
  documents: [
    {
      _id: new mongoose.Types.ObjectId(),
      emailAddress: "user0@test.com",
      password: "password1",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      emailAddress: "user1@test.com",
      password: "password2",
    },
  ],
  submissions: [
    {
      emailAddress: "user0@test.com",
      password: "hashedPassword1",
    },
    {
      emailAddress: "user1@test.com",
      password: "hashedPassword2",
    },
  ],
};

export default userData;
