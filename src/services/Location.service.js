import Location from "../models/Location.model.js";

export default class LocationService {
    addLocation = async (submittedLocationDetails) => {
        //Format submitted details
        const newLocation = this.#formatBodyForCreate(submittedLocationDetails);
        //Check if location exists
        let locationDoc = await Location.findOne({
            coordinateIdentifier: newLocation.coordinateIdentifier,
        });
        //If location not in database create the location
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
            coordinateIdentifier: this.#getCoordinateIdentifier(
                latitude,
                longitude,
            ),
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
