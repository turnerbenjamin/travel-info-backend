import jwt from "jsonwebtoken";

const signAndSendJWT = async (req, res) => {
  jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export default signAndSendJWT;
