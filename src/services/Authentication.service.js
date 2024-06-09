import User from "../models/User.model.js";
import HTTPError from "../utils/HTTPError.js";

export default class AuthenticationService {
  createUser = async (emailAddress, hashedPassword) => {
    try {
      await User.create({ emailAddress, password: hashedPassword });
    } catch (err) {
      if (err.code === 11000)
        throw new HTTPError(400, "A user with this email already exists");
      throw err;
    }
  };
}
