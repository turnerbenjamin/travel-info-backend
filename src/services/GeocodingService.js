import axios from "axios";

export default class GeocodingService {
  getLocations = async (searchTerm) => {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm},,GB&appid=${process.env.OPEN_WEATHER_API_KEY}`;
    await axios.get(url);
  };
}
