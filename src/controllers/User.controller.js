import HTTPError from "../utils/HTTPError.js";

export default class UserController {
  #locationService;
  constructor(locationService) {
    this.#locationService = locationService;
  }
  addLocationToFavourites = async (req, res) => {
    try {
      if (!req.user) throw new HTTPError(500, "Server error");
      const location = await this.#locationService.addLocation(req.body);
    } catch (err) {
      const message = err.messageForUsers || "Server error";
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ message });
    }
  };
}
