import User from "../models/User.model.js";
import HTTPError from "../utils/HTTPError.js";

export default class UserService {
  /**
   * Creates a new user with the provided email address and hashed password.
   * @param {string} emailAddress - The email address of the new user.
   * @param {string} hashedPassword - The hashed password for the new user.
   * @returns {Promise<string>} The ID of the newly created user.
   * @throws {HTTPError} Throws an HTTPError with status 400 if a user with the given email already exists.
   * @throws {HTTPError} Throws an HTTPError with status 500 for any other errors.
   */
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

  /**
   * Finds a user by their ID.
   * @param {string} id - The ID of the user to find.
   * @param {boolean} doIncludePassword - Whether to include the user's password in the returned object.
   * @returns {Promise<Object>} The found user object.
   * @throws {HTTPError} Throws an HTTPError with status 500 for any errors.
   */
  findById = async (id, doIncludePassword) => {
    try {
      const user = await User.findById(id).select(
        doIncludePassword ? "+password" : undefined
      );
      return user;
    } catch (err) {
      throw new HTTPError(500, "Server error");
    }
  };

  /**
   * Finds a user by their email address.
   * @param {string} emailAddress - The email address of the user to find.
   * @returns {Promise<Object>} The found user object.
   * @throws {HTTPError} Throws an HTTPError with status 500 for any errors.
   */
  findByEmailAddress = async (emailAddress) => {
    try {
      const user = await User.findOne({ emailAddress }).select("+password");
      return user;
    } catch (err) {
      throw new HTTPError(500, "Server Error");
    }
  };

  /**
   * Updates a user by their ID with the provided update object.
   * @param {string} id - The ID of the user to update.
   * @param {Object} update - An object containing the updates to apply to the user.
   * @returns {Promise<Object>} The updated user object.
   * @throws {HTTPError} Throws an HTTPError with status 500 for any errors.
   */
  updateById = async (id, update) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(id, update, {
        new: true,
      });
      return updatedUser;
    } catch (err) {
      throw new HTTPError(500, "Server error");
    }
  };
}
