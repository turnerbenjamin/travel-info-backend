export default class GeocodingController {
  #geocodingService;

  constructor(geocodingService) {
    this.#geocodingService = geocodingService;
  }

  getLocations = async (req, res) => {
    try {
      const { searchTerm } = req.query;
      const results = await this.#geocodingService.getLocations(searchTerm);
      res.status(200).json(this.#formatted(results));
    } catch (err) {
      res.status(500).json("Server error");
    }
  };

  #formatted = (results) => {
    return results.map((result) => {
      return {
        label: result.name,
        latitude: result.lat,
        longitude: result.lon,
      };
    });
  };
}
