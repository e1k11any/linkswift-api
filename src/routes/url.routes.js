import { Router } from "express";
import { shortenUrl } from "../controllers/url.controller.js";
import {
  shortenUrlRules,
  handleValidationErrors,
} from "../middleware/validators.js";

const router = Router();

/**
 * @route   POST /api/v1/shorten
 * @desc    Create a new short URL
 * @access  Public
 */
router.post("/shorten", shortenUrlRules, handleValidationErrors, shortenUrl);

export default router;
