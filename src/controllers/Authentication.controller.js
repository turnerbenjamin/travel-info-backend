import bcrypt from "bcrypt";

export default class AuthenticationController {
  #userService;

  constructor(userService) {
    this.#userService = userService;
  }

  register = async (req, res) => {
    const { emailAddress, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.#userService.createUser(emailAddress, hashedPassword);
    } catch (err) {
      this.#handleError(res, err);
    }
  };

  #handleError(res, err) {
    const message = err.messageForUsers || "Server error";
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message });
  }
}
