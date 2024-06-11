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
      if (!user) this.#throwUnauthorisedError();
      await this.#validatePassword(res, password, user.password);
      this.#attachUserToReq(req, user);
      next();
    } catch (err) {
      this.#handleError(res, err);
    }
  };

  requireLoggedIn = () => {
    return async (req, res, next) => {
      try {
        const decodedJWT = this.#readJWT(req, res);
        const user = await this.#userService.findById(decodedJWT._id, true);
        if (!user) this.#throwUnauthorisedError();
        this.#attachUserToReq(req, user);
        console.log(user);
        next();
      } catch (err) {
        this.#handleError(res, err);
      }
    };
  };

  #readJWT = (req, res) => {
    try {
      if (!req?.cookies?.jwt) this.#throwUnauthorisedError();
      return jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
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

  #validatePassword = async (res, submittedPassword, storedPassword) => {
    const isValid = await bcrypt.compare(submittedPassword, storedPassword);
    if (!isValid) this.#throwUnauthorisedError();
  };

  #throwUnauthorisedError = () => {
    throw new HTTPError(401, "Incorrect log-in details");
  };

  #handleError(res, err) {
    const message = err.messageForUsers || "Server error";
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message });
  }
}
