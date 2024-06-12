export default class GeocodingController {
  #geocodingService;

  constructor(geocodingService) {
    this.#geocodingService = geocodingService;
  }

  getLocations = async (req, res) => {
    try {
      const { searchTerm } = req.query;
      await this.#geocodingService.getLocations(searchTerm);
      res.status(200);
    } catch (err) {
      res.status(500).json("Server error");
    }
  };
}
