import jwt from "jsonwebtoken";

const signAndSendJWT = (req, res) => {
  try {
    jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export default signAndSendJWT;
