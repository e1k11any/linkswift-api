import { Router } from "express";
import { redirectToUrl } from "../controllers/url.controller.js";

const router = Router();

/**
 * @route   GET /:shortCode
 * @desc    Redirect to the original long URL
 * @access  Public
 */
router.get("/:shortCode", redirectToUrl);

export default router;
