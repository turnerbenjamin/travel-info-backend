import * as expressValidator from "express-validator";

export default class WeatherQueryValidator {
  static validate = () => {
    return [
      expressValidator
        .query("latitude")
        .trim()
        .notEmpty()
        .withMessage("Latitude cannot be empty")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Invalid latitude"),

      expressValidator
        .query("longitude")
        .trim()
        .notEmpty()
        .withMessage("Longitude cannot be empty")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Invalid longitude"),
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
