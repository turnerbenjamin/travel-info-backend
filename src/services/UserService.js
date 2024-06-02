import User from "../models/User.model.js";

export default class UserService {
  addLocationToFavourites = (userToUpdate, locationToAddToFavourites) => {
    User.findByIdAndUpdate(
      userToUpdate._id,
      {
        $push: { FavouriteLocations: locationToAddToFavourites._id },
      },
      { new: true }
    );
  };
}
