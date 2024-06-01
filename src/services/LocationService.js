import Location from "../models/Location.model.js";

export default class LocationService {
  addLocation = async (submittedLocationDetails) => {
    const newLocationObject = this.#parseLocationObjectFromSubmittedDetails(
      submittedLocationDetails
    );
    let location = await Location.findOne({
      coordinateIdentifier: newLocationObject.coordinateIdentifier,
    });
    if (!location) location = await Location.create(newLocationObject);
    return location;
  };

  #parseLocationObjectFromSubmittedDetails = (submittedLocationDetails) => {
    return {
      label: submittedLocationDetails.label,
      coordinateIdentifier: `${submittedLocationDetails.latitude},${submittedLocationDetails.longitude}`,
      latAndLong: {
        type: "Point",
        coordinates: [
          submittedLocationDetails.longitude,
          submittedLocationDetails.latitude,
        ],
      },
    };
  };
}
