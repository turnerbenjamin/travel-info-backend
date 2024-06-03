import FavouritedLocation from "../models/FavouritedLocation.model.js";

export default class FavouritedLocationService {
  addFavourite = async (user, location) => {
    const userFavourite = await FavouritedLocation.findOne({
      user: user._id,
      location: location._id,
    });
    if (!userFavourite) await this.#createNewFavouriteLocation(user, location);
    const userFavourites = await FavouritedLocation.find({ user: user._id });
    return userFavourites;
  };

  #createNewFavouriteLocation = async (user, location) => {
    await FavouritedLocation.create({
      user: user._id,
      location: location._id,
    });
  };
}
