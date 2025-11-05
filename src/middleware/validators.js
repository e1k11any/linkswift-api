import { body, validationResult } from "express-validator";

/**
 * Handles validation errors from express-validator
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next(); // If no errors, proceed to the controller
};

/**
 * Validation rules for the /shorten endpoint
 */
export const shortenUrlRules = [
  body("longUrl")
    .notEmpty()
    .withMessage("longUrl is required")
    .isURL({
      protocols: ["http", "https"], // Only allow http and https
      require_protocol: true, // Must have http:// or https://
      require_valid_protocol: true,
    })
    .withMessage(
      "Invalid URL: Must be a valid URL with http or https protocol"
    ),
];
