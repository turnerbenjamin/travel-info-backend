import * as expressValidator from "express-validator";

export default class GeocodingQueryValidator {
  static validate = () => {
    return [
      expressValidator
        .query("searchTerm")
        .trim()
        .notEmpty()
        .withMessage("Search term cannot be empty"),
      GeocodingQueryValidator.handleValidationErrors,
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
