import FavouritedLocation from "../models/FavouritedLocation.model.js";
import HTTPError from "../../src/utils/HTTPError.js";

export default class FavouritedLocationService {
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

  #checkIfDuplicate = async (user, location) => {
    const existingDocument = await this.#getFavourite(user, location);
    if (existingDocument)
      throw new HTTPError(400, "Location has already been favourited");
  };

  getUserFavourites = async (user) => {
    const userFavourites = await FavouritedLocation.find({
      user: user._id,
    }).populate("location");
    return userFavourites.map((favouritedLocation) =>
      this.#formatLocationForResponse(favouritedLocation.location)
    );
  };

  deleteById = async (user, id) => {
    if (!id) throw new Error("Id is undefined");
    const deletedDoc = await FavouritedLocation.findOneAndDelete({
      user: user._id,
      _id: id,
    });
    if (!deletedDoc) throw new HTTPError(404, "Favourited location not found");
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
