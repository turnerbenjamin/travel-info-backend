export default class UserController {
  #locationService;
  constructor(locationService) {
    this.#locationService = locationService;
  }
  addLocationToFavourites = async (req, res) => {
    try {
      const location = await this.#locationService.addLocation(req.body);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };
}
