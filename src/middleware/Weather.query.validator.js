import * as expressValidator from "express-validator";

export default class WeatherQueryValidator {
  static validate = () => {
    return [
      expressValidator
        .query("latitude")
        .trim()
        .notEmpty()
        .withMessage("Latitude cannot be empty")
        .isNumeric()
        .withMessage("Latitude must be numeric"),
      expressValidator
        .query("longitude")
        .trim()
        .notEmpty()
        .withMessage("Latitude cannot be empty"),
      WeatherQueryValidator.handleValidationErrors,
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
