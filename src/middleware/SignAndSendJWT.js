import jwt from "jsonwebtoken";

const signAndSendJWT = (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.cookie("jwt", token, {
      maxAge: process.env.COOKIE_EXPIRES_IN,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
    });
    res.status(200).json(req.user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export default signAndSendJWT;
