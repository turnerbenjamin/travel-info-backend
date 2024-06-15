import Location from "../models/Location.model.js";

export default class LocationService {
  /**
   * Adds a new location to the database if it does not already exist
   * @param {Object} submittedLocationDetails - The details of the location to add, including label, latitude, and longitude.
   * @returns {Promise<Object>} A promise that resolves to the formatted document of the added or existing location.
   * @async
   */
  addLocation = async (submittedLocationDetails) => {
    const newLocation = this.#formatBodyForCreate(submittedLocationDetails);
    let locationDoc = await Location.findOne({
      coordinateIdentifier: newLocation.coordinateIdentifier,
    });
    if (!locationDoc) locationDoc = await Location.create(newLocation);
    return this.#formatDocForResponse(locationDoc);
  };

  #getCoordinateIdentifier = (latitude, longitude) => {
    return `${latitude},${longitude}`;
  };

  #getGeoJsonPoint(latitude, longitude) {
    return {
      type: "Point",
      coordinates: [longitude, latitude],
    };
  }

  #formatBodyForCreate = ({ label, latitude, longitude }) => {
    return {
      label,
      coordinateIdentifier: this.#getCoordinateIdentifier(latitude, longitude),
      latAndLong: this.#getGeoJsonPoint(latitude, longitude),
    };
  };

  #formatDocForResponse = ({ _id, label, latAndLong }) => {
    const [longitude, latitude] = latAndLong.coordinates;
    return {
      _id,
      label,
      latitude,
      longitude,
    };
  };
}
