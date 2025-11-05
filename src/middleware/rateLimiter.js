import { rateLimit } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redisClient } from "../config/db.js";

/**
 * @middleware  apiLimiter
 * @desc        Limits each IP to 20 create requests per hour
 */
export const apiLimiter = rateLimit({
  // Create a new store *inside* this limiter's config
  store: new RedisStore({
    // @ts-expect-error - types are slightly off
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: "api", // Use a prefix to separate keys in Redis
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    message: "Too many requests from this IP, please try again after an hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @middleware  redirectLimiter
 * @desc        A more lenient limiter for redirect links
 */
export const redirectLimiter = rateLimit({
  // Create another *new* store *inside* this limiter's config
  store: new RedisStore({
    // @ts-expect-error - types are slightly off
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: "redirect", // Use a different prefix
  }),
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  message: {
    message: "Too many redirect requests from this IP",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
