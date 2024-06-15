import FavouritedLocation from "../models/FavouritedLocation.model.js";
import HTTPError from "../../src/utils/HTTPError.js";

export default class FavouritedLocationService {
  /**
   * Adds a location to the user's list of favourite locations.
   *
   * @param {Object} user - The user object.
   * @param {Object} location - The location object to be added to favourites.
   * @returns {Promise<Object>} The newly added favourite location, formatted for the response.
   */
  addFavourite = async (user, location) => {
    await this.#checkIfDuplicate(user, location);
    const userFavourite = await this.#createNewFavouriteLocation(
      user,
      location
    );
    const formattedUserFavourite =
      await this.#getFavouriteByIdAndFormatForResponse(userFavourite._id);
    return formattedUserFavourite;
  };

  /**
   * Retrieves all favourite locations for a given user.
   *
   * @param {Object} user - The user object.
   * @returns {Promise<Array>} An array of user's favourite locations, formatted for the response.
   */
  getUserFavourites = async (user) => {
    const userFavourites = await FavouritedLocation.find({
      user: user._id,
    }).populate("location");
    return userFavourites.map((favouritedLocation) =>
      this.#formatLocationForResponse(favouritedLocation.location)
    );
  };

  /**
   * Deletes a favourite location by its ID for a given user.
   *
   * @param {Object} user - The user object.
   * @param {String} id - The ID of the favourite location to be deleted.
   * @throws {Error} If the ID is undefined.
   * @throws {HTTPError} If the favourite location is not found.
   * @returns {Promise<void>}
   */
  deleteById = async (user, id) => {
    if (!id) throw new Error("Id is undefined");
    const deletedDoc = await FavouritedLocation.findOneAndDelete({
      user: user._id,
      location: id,
    });
    if (!deletedDoc) throw new HTTPError(404, "Favourited location not found");
  };

  #checkIfDuplicate = async (user, location) => {
    const existingDocument = await this.#getFavourite(user, location);
    if (existingDocument)
      throw new HTTPError(400, "Location has already been favourited");
  };

  #getFavouriteByIdAndFormatForResponse = async (favouritedLocationId) => {
    const favouritedLocationDoc = await FavouritedLocation.findById(
      favouritedLocationId
    ).populate("location");
    return this.#formatLocationForResponse(favouritedLocationDoc.location);
  };

  #formatLocationForResponse = ({ label, latAndLong, _id }) => {
    return {
      _id,
      label,
      latitude: latAndLong.coordinates[1],
      longitude: latAndLong.coordinates[0],
    };
  };

  #getFavourite = async (user, location) => {
    const userFavourite = await FavouritedLocation.findOne({
      user: user._id,
      location: location._id,
    });
    return userFavourite;
  };

  #createNewFavouriteLocation = async (user, location) => {
    const newFavouriteLocation = await FavouritedLocation.create({
      user: user._id,
      location: location._id,
    });
    return newFavouriteLocation;
  };
}
