import Location from "../models/Location.model.js";

export default class LocationService {
  addLocation = async (newLocationDetails) => {
    const coordinateIdentifier = `${newLocationDetails.latitude},${newLocationDetails.longitude}`;
    const location = await Location.findOne({ coordinateIdentifier });
    return location;
  };
}
