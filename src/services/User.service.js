import User from "../models/User.model.js";

export default class UserService {
  addLocationToFavourites = async (userToUpdate, locationToAddToFavourites) => {
    const updatedUser = await User.findByIdAndUpdate(
      userToUpdate._id,
      {
        $push: { FavouriteLocations: locationToAddToFavourites._id },
      },
      { new: true }
    );
    return updatedUser;
  };
}
