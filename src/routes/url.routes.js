import { Router } from "express";
import { shortenUrl, getAllLinks } from "../controllers/url.controller.js";
import {
  shortenUrlRules,
  handleValidationErrors,
} from "../middleware/validators.js";
import { apiLimiter } from "../middleware/rateLimiter.js";
const router = Router();

/**
 * @route   POST /api/v1/shorten
 * @desc    Create a new short URL
 * @access  Public
 */
router.post(
  "/shorten",
  apiLimiter,
  shortenUrlRules,
  handleValidationErrors,
  shortenUrl
);

/**
 * @route   GET /api/v1/links
 * @desc    Get all links for analytics
 * @access  Public (or protected, but public for now)
 */
router.get(
  "/links",
  apiLimiter, // Use the same limiter as our POST route
  getAllLinks
);

export default router;
