import HTTPError from "../utils/HTTPError.js";

export default class UserController {
  #locationService;
  #favouriteLocationService;
  constructor(favouriteLocationService, locationService) {
    this.#favouriteLocationService = favouriteLocationService;
    this.#locationService = locationService;
  }

  /**
   * Adds a location to the user's favourites.
   * @param {Object} req - The request object, expected to contain a user and the location details in the body.
   * @param {Object} res - The response object used to send back the HTTP response.
   */
  addLocationToFavourites = async (req, res) => {
    try {
      if (!req.user) throw new HTTPError(500, "Server error");
      if (!req.body) throw new HTTPError(400, "Invalid location");
      const location = await this.#locationService.addLocation(req.body);
      const updatedFavouriteLocations =
        await this.#favouriteLocationService.addFavourite(req.user, location);
      res.status(201).json(updatedFavouriteLocations);
    } catch (err) {
      this.#handleError(res, err);
    }
  };

  /**
   * Retrieves the user's favourite locations.
   * @param {Object} req - The request object, expected to contain a user.
   * @param {Object} res - The response object used to send back the HTTP response.
   */
  getUserFavouriteLocations = async (req, res) => {
    try {
      if (!req.user) throw new HTTPError(500, "Server error");
      const userFavourites =
        await this.#favouriteLocationService.getUserFavourites(req.user);
      res.status(200).json(userFavourites);
    } catch (err) {
      this.#handleError(res, err);
    }
  };

  /**
   * Deletes a user's favourite location by its ID.
   * @param {Object} req - The request object, expected to contain a user and the location ID as a parameter.
   * @param {Object} res - The response object used to send back the HTTP response.
   */
  deleteById = async (req, res) => {
    try {
      const locationId = req.params.locationId;
      if (!req.user) throw new HTTPError(500, "Server error");
      await this.#favouriteLocationService.deleteById(req.user, locationId);
      res.status(204).json(undefined);
    } catch (err) {
      this.#handleError(res, err);
    }
  };

  #handleError(res, err) {
    const message = err.messageForUsers || "Server error";
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message });
  }
}
