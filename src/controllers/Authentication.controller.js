import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
      const { emailAddress, password } = req.body;
      const user = await this.#userService.findByEmailAddress(emailAddress);
      if (!user) throw new HTTPError(401, "Incorrect log-in details");
      await this.#validatePassword(password, user.password);
      this.#attachUserToReq(req, user);
      next();
    } catch (err) {
      this.#handleError(res, err);
    }
  };

  protect = async (req, res, next) => {
    try {
      if (!req?.cookies?.jwt)
        throw new HTTPError(
          401,
          "You are not authorised to access this resource"
        );
      jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    } catch (err) {
      this.#handleError(res, err);
    }
  };

  #attachUserToReq = (req, user) => {
    req.user = {
      _id: user._id,
      emailAddress: user.emailAddress,
    };
  };

  #validatePassword = async (submittedPassword, storedPassword) => {
    const isValid = await bcrypt.compare(submittedPassword, storedPassword);
    if (!isValid) throw new HTTPError(401, "Incorrect log-in details");
  };

  #handleError(res, err) {
    const message = err.messageForUsers || "Server error";
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message });
  }
}
