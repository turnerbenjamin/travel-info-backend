import bcrypt from "bcrypt";

export default class AuthenticationController {
  #userService;

  constructor(userService) {
    this.#userService = userService;
  }

  register = async (req, res) => {
    const { emailAddress, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.#userService.createUser(emailAddress, hashedPassword);
  };
}
