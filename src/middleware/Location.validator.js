import * as expressValidator from "express-validator";

export default class LocationValidator {
  static validate = () => {
    return [
      expressValidator
        .body("label")
        .notEmpty()
        .withMessage("A label is required"),
      LocationValidator.handleValidationErrors,
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
