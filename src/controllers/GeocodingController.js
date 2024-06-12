export default class GeocodingController {
  #geocodingService;

  constructor(geocodingService) {
    this.#geocodingService = geocodingService;
  }

  getLocations(req) {
    const { searchTerm } = req.query;
    this.#geocodingService.getLocations(searchTerm);
  }
}
