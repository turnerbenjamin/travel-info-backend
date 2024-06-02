import Location from "../models/Location.model.js";
export default class LocationService {
  addLocation = async (submittedLocationDetails) => {
    //Format submitted details
    const newLocation = this.#parse(submittedLocationDetails);
    //Check if location exists
    let locationDoc = await Location.findOne({
      coordinateIdentifier: newLocation.coordinateIdentifier,
    });
    //If location not in database create the location
    if (!locationDoc) locationDoc = await Location.create(newLocation);
    return locationDoc;
  };

  #parse = (submittedLocationDetails) => {
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
