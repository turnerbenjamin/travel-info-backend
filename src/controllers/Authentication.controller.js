import bcrypt from "bcrypt";
import HTTPError from "../utils/HTTPError.js";

export default class AuthenticationController {
  #userService;

  constructor(userService) {
    this.#userService = userService;
  }

  register = async (req, res) => {
    const { emailAddress, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.#userService.createUser(emailAddress, hashedPassword);
      res.status(201).json(undefined);
    } catch (err) {
      this.#handleError(res, err);
    }
  };

  signIn = async (req, res, next) => {
    try {
      const { emailAddress } = req.body;
      const user = await this.#userService.findByEmailAddress(emailAddress);
      if (!user) throw new HTTPError(401, "Incorrect log-in details");
    } catch (err) {
      this.#handleError(res, err);
    }
  };

  #handleError(res, err) {
    const message = err.messageForUsers || "Server error";
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message });
  }
}
