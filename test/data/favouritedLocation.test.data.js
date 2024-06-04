import mongoose from "mongoose";

import locationData from "./location.test.data.js";
import userData from "./user.test.data.js";

const favouritedLocationData = {
  documents: [
    {
      _id: new mongoose.Types.ObjectId(),
      user: userData.documents[0]._id,
      location: locationData.documents[0]._id,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: userData.documents[1]._id,
      location: locationData.documents[1]._id,
    },
  ],

  populatedDocuments: [
    {
      user: userData.documents[0]._id,
      location: locationData.documents[0],
    },
    {
      user: userData.documents[1]._id,
      location: locationData.documents[1],
    },
  ],

  formattedResponse: [
    locationData.formattedResponses[0],
    locationData.formattedResponses[1],
  ],
};

export default favouritedLocationData;
