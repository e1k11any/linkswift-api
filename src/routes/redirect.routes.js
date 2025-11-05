import { Router } from "express";
import { redirectToUrl } from "../controllers/url.controller.js";
import { redirectLimiter } from "../middleware/rateLimiter.js";
const router = Router();

/**
 * @route   GET /:shortCode
 * @desc    Redirect to the original long URL
 * @access  Public
 */
router.get("/:shortCode", redirectLimiter, redirectToUrl);

export default router;
