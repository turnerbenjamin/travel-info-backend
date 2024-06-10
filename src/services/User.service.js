import User from "../models/User.model.js";
import HTTPError from "../utils/HTTPError.js";

export default class UserService {
  createUser = async (emailAddress, hashedPassword) => {
    try {
      const newUser = await User.create({
        emailAddress,
        password: hashedPassword,
      });
      return newUser._id;
    } catch (err) {
      if (err.code === 11000)
        throw new HTTPError(400, "A user with this email already exists");
      throw new HTTPError(500, "Server error");
    }
  };

  findByEmailAddress = async (emailAddress) => {
    try {
      const user = await User.findOne({ emailAddress }).select("+password");
      return user;
    } catch (err) {
      throw new HTTPError(500, "Server Error");
    }
  };
}
