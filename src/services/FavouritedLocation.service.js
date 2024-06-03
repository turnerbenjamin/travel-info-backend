import FavouritedLocation from "../models/FavouritedLocation.model.js";

export default class FavouritedLocationService {
  addFavourite = async (user, location) => {
    const userFavourites = await FavouritedLocation.find({ user: user._id });
    if (!this.#locationIsInUserFavourites(userFavourites, location)) {
      const newFavourite = await FavouritedLocation.create({
        user: user._id,
        location: location._id,
      });
    }
    return userFavourites;
  };

  #locationIsInUserFavourites = (userFavourites, location) => {
    let locationId = location?._id?.toString();
    for (let i = 0; i < userFavourites.length; i++) {
      if (userFavourites[i].location.toString() === locationId) return true;
    }
    return false;
  };
}
