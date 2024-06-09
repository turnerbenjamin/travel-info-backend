import User from "../models/User.model.js";

export default class AuthenticationService {
  createUser = async (emailAddress, hashedPassword) => {
    await User.create({ emailAddress, password: hashedPassword });
  };
}
