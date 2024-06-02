export default class UserController {
  #locationService;
  constructor(locationService) {
    this.#locationService = locationService;
  }
  addLocationToFavourites = async (req, res) => {
    const location = await this.#locationService.addLocation(req.body);
  };
}
