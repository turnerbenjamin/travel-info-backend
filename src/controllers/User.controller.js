import HTTPError from "../utils/HTTPError.js";

export default class UserController {
  #locationService;
  constructor(locationService) {
    this.#locationService = locationService;
  }
  addLocationToFavourites = async (req, res) => {
    try {
      if (!req.user) throw new HTTPError(500, "Server error");
      if (!req.body) throw new HTTPError(400, "Invalid location");
      const location = await this.#locationService.addLocation(req.body);
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
