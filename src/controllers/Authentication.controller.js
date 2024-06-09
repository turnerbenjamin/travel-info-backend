import bcrypt from "bcrypt";

export default class AuthenticationController {
  register = async (req, res) => {
    const { password } = req.body;
    await bcrypt.hash(password, 10);
  };
}
