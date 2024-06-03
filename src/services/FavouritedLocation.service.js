import FavouritedLocation from "../models/FavouritedLocation.model.js";

export default class FavouritedLocationService {
  addFavourite = async (user, location) => {
    const userFavourite = await this.#getFavourite(user, location);
    if (!userFavourite) await this.#createNewFavouriteLocation(user, location);
    const userFavourites = await this.getUserFavourites(user);
    return userFavourites;
  };

  getUserFavourites = async (user) => {
    const userFavourites = await FavouritedLocation.find({
      user: user._id,
    }).populate("location");
    return userFavourites.map((favouritedLocation) =>
      this.#formatLocationForResponse(favouritedLocation.location)
    );
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
    await FavouritedLocation.create({
      user: user._id,
      location: location._id,
    });
  };
}
