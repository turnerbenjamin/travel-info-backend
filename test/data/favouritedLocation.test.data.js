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

  populatedDocuments: [
    {
      user: userData.documents[0]._id,
      location: locationData.documents[0],
    },
    {
      user: userData.documents[0]._id,
      location: locationData.documents[1],
    },
  ],

  formattedResponse: [
    locationData.formattedResponses[0],
    locationData.formattedResponses[1],
  ],
};

export default favouritedLocationData;
