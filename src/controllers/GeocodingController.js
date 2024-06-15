export default class GeocodingController {
  #geocodingService;

  constructor(geocodingService) {
    this.#geocodingService = geocodingService;
  }

  /**
   * Handles the request to get geocoded locations based on a search term.
   * It expects a query parameter 'searchTerm' to be provided
   * with the request.
   *
   * @param {Object} req - The request object, containing the query parameters.
   * @param {Object} res - The response object used to send back the HTTP response.
   * @async
   */
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
