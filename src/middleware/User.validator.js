import * as expressValidator from "express-validator";

export default class UserValidator {
  static validate = () => {
    return [
      expressValidator
        .body("emailAddress")
        .exists()
        .trim()
        .notEmpty()
        .withMessage("Email address is required"),
      expressValidator
        .body("emailAddress")
        .isEmail()
        .withMessage("Email address is invalid"),
      UserValidator.handleValidationErrors,
    ];
  };

  static handleValidationErrors = (req, res, next) => {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
}
