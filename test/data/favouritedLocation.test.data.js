import locationData from "./location.test.data.js";
import userData from "./user.test.data.js";

const favouritedLocationData = {
  documents: [
    {
      user: userData.documents[0]._id,
      location: locationData.documents[0]._id,
    },
    {
      user: userData.documents[0]._id,
      location: locationData.documents[1]._id,
    },
  ],
};

export default favouritedLocationData;
