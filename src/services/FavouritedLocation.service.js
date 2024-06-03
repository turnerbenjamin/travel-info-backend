import FavouritedLocation from "../models/FavouritedLocation.model.js";

export default class FavouritedLocationService {
  addFavourite = async (user, location) => {
    const userFavourites = await FavouritedLocation.find({ user: user._id });
    return userFavourites;
  };
}
