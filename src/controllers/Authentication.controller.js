import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import HTTPError from "../utils/HTTPError.js";

export default class AuthenticationController {
  #userService;

  constructor(userService) {
    this.#userService = userService;
  }

  /**
   * Registers a new user with the provided email address and password.
   * The password is hashed before storing it in the database.
   *
   * @param {Object} req - The request object containing user data.
   * @param {Object} res - The response object used to send back the HTTP response.
   */
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

  /**
   * Authenticates a user by comparing the provided password with the stored hashed password.
   * If authentication is successful, the user object is attached to the request object for further processing.
   *
   * @param {Object} req - The request object containing login credentials.
   * @param {Object} res - The response object used to send back the HTTP response.
   * @param {Function} next - The next middleware function in the stack.
   */
  signIn = async (req, res, next) => {
    try {
      const { emailAddress, password } = req.body;
      const user = await this.#userService.findByEmailAddress(emailAddress);
      if (!user) this.#throwUnauthorisedError();
      await this.#validatePassword(password, user.password);
      this.#attachUserToReq(req, user);
      next();
    } catch (err) {
      this.#handleError(res, err);
    }
  };

  /**
   * Updates the password of the currently authenticated user.
   * The new password is hashed before updating it in the database.
   *
   * @param {Object} req - The request object containing the new password and the authenticated user's details.
   * @param {Object} res - The response object used to send back the HTTP response.
   */
  updatePassword = async (req, res) => {
    try {
      const { updatedPassword } = req.body;
      const hashedPassword = await bcrypt.hash(updatedPassword, 10);
      const updatedUser = await this.#userService.updateById(req.user._id, {
        password: hashedPassword,
      });
      res.status(200).json(updatedUser);
    } catch (err) {
      this.#handleError(res, err);
    }
  };

  /**
   * Middleware to ensure that a request is made by a logged-in user.
   * It authenticates the user by decoding the JWT from the request and fetching the user from the database.
   * If the user is found and valid, it attaches the user object to the request for further processing.
   * Optionally, it can re-validate the user's password if required by the options.
   *
   * @param {Object} options - Optional parameters to customize the authentication process, such as requiring password re-validation.
   * @returns {Function} A middleware function that takes the request, response, and next middleware function in the stack.
   */
  requireLoggedIn = (options) => {
    return async (req, res, next) => {
      try {
        const user = await this.#authenticateUser(req, options);
        this.#attachUserToReq(req, user);
        await this.#reValidatePasswordIfRequired(req, options, user);
        next();
      } catch (err) {
        this.#handleError(res, err);
      }
    };
  };

  #authenticateUser = async (req, options) => {
    const decodedJWT = this.#decodeJWT(req);
    const user = await this.#userService.findById(
      decodedJWT._id,
      !!options?.requirePassword
    );
    if (!user) this.#throwUnauthorisedError();
    return user;
  };

  #reValidatePasswordIfRequired = async (req, options, user) => {
    if (options?.requirePassword)
      await this.#validatePassword(req.body?.password, user.password);
  };

  #decodeJWT = (req) => {
    if (!req?.cookies?.jwt) this.#throwUnauthorisedError();
    return jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  };

  #attachUserToReq = (req, user) => {
    req.user = {
      _id: user._id,
      emailAddress: user.emailAddress,
    };
  };

  #validatePassword = async (submittedPassword, storedPassword) => {
    if (!submittedPassword || !storedPassword) this.#throwUnauthorisedError();
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
