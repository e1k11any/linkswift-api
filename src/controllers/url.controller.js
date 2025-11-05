import { nanoid } from "nanoid";
import Url from "../models/Url.js";
import { redisClient } from "../config/db.js";
import asyncHandler from "express-async-handler";

/**
 * @controller  shortenUrl
 * @desc        Shortens a long URL and saves it to the database.
 * @param {import('express').Request} req - Express request object.
 * Expects { longUrl: "..." } in req.body.
 * @param {import('express').Response} res - Express response object.
 * @returns     {Promise<void>}
 */
// export const shortenUrl = async (req, res) => {
//   // We can trust longUrl exists and is valid because the validator middleware ran first!
//   const { longUrl } = req.body;

//   try {
//     // --- 1. Check if URL already exists in DB (Good Practice!) ---
//     // We don't want to create 100 short links for the same google.com
//     const existingUrl = await Url.findOne({ longUrl });
//     if (existingUrl) {
//       const baseUrl =
//         process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
//       const shortUrl = `${baseUrl}/${existingUrl.shortCode}`;

//       // Return 200 OK, not 201 Created, because we found an existing one
//       return res.status(200).json({ shortUrl });
//     }

//     // --- 2. If not, generate new Short Code ---
//     const shortCode = nanoid(7);

//     // --- 3. Save to Database ---
//     const newUrl = new Url({
//       longUrl,
//       shortCode,
//     });
//     await newUrl.save();

//     // --- 4. Create the Full Short URL ---
//     const baseUrl =
//       process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
//     const shortUrl = `${baseUrl}/${shortCode}`;

//     // --- 5. Respond ---
//     return res.status(201).json({ shortUrl });
//   } catch (error) {
//     // Handle potential errors (like a database crash or duplicate shortCode)
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

export const shortenUrl = asyncHandler(async (req, res) => {
  // NO try...catch needed!
  const { longUrl } = req.body;

  // 1. Check if URL already exists
  const existingUrl = await Url.findOne({ longUrl });
  if (existingUrl) {
    const baseUrl =
      process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const shortUrl = `${baseUrl}/${existingUrl.shortCode}`;
    return res.status(200).json({ shortUrl });
  }

  // 2. If not, generate new Short Code
  const shortCode = nanoid(7);

  // 3. Save to Database
  const newUrl = new Url({
    longUrl,
    shortCode,
  });
  await newUrl.save(); // If this throws an error, asyncHandler catches it

  // 4. Create the Full Short URL
  const baseUrl =
    process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  const shortUrl = `${baseUrl}/${shortCode}`;

  // 5. Respond
  return res.status(201).json({ shortUrl });
});

/**
 * @controller  redirectToUrl
 * @desc        Finds a shortCode and redirects to its longUrl.
 * Implements a cache-aside strategy with Redis.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns     {Promise<void>}
 */
// export const redirectToUrl = async (req, res) => {
//   try {
//     const { shortCode } = req.params;

//     // --- 1. Check the Cache (Redis) ---
//     const cachedUrl = await redisClient.get(shortCode);

//     if (cachedUrl) {
//       // CACHE HIT: Found in Redis
//       return res.redirect(302, cachedUrl);
//     }

//     // --- 2. Cache Miss: Check the Database (Mongo) ---
//     const urlDoc = await Url.findOne({ shortCode });

//     // --- 3. Handle Not Found ---
//     if (!urlDoc) {
//       return res.status(404).json({ message: "Short URL not found" });
//     }

//     // --- 4. Handle Found (Save to Cache & Redirect) ---

//     // Save to Redis for next time.
//     // We set an 'EX' (expire) of 1 hour (3600s) as an example.
//     await redisClient.set(shortCode, urlDoc.longUrl, { EX: 3600 });

//     // Perform the redirect
//     return res.redirect(302, urlDoc.longUrl);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// export const redirectToUrl = asyncHandler(async (req, res) => {
//   // NO try...catch needed!
//   const { shortCode } = req.params;

//   // 1. Check the Cache (Redis)
//   const cachedUrl = await redisClient.get(shortCode);
//   if (cachedUrl) {
//     return res.redirect(302, cachedUrl);
//   }

//   // 2. Cache Miss: Check the Database (Mongo)
//   const urlDoc = await Url.findOne({ shortCode }); // If this errors, it's caught

//   // 3. Handle Not Found (This is NOT an error, it's a response)
//   if (!urlDoc) {
//     // We'll improve this in a bit
//     return res.status(404).json({ message: "Short URL not found" });
//   }

//   // 4. Handle Found (Save to Cache & Redirect)
//   await redisClient.set(shortCode, urlDoc.longUrl, { EX: 3600 });
//   return res.redirect(302, urlDoc.longUrl);
// });

// export const redirectToUrl = asyncHandler(async (req, res) => {
//   const { shortCode } = req.params;

//   // 1. Check Cache
//   const cachedUrl = await redisClient.get(shortCode);
//   if (cachedUrl) {
//     // We *could* increment clicks here, but it's safer to do it
//     // when we are 100% sure it's a valid link from the DB.
//     // Let's do it on cache miss, or use a separate analytics service.
//     // For simplicity, we'll increment *after* the DB find.

//     // We'll update this in a moment. For now, just redirect.
//     return res.redirect(302, cachedUrl);
//   }

//   // 2. Cache Miss: Find in DB and *increment clicks*
//   const urlDoc = await Url.findOneAndUpdate(
//     { shortCode }, // Find by shortCode
//     { $inc: { clicks: 1 } } // Increment the 'clicks' field by 1
//   );

//   // 3. Handle Not Found
//   if (!urlDoc) {
//     return res.status(404).json({ message: "Short URL not found" });
//   }

//   // 4. Handle Found (Save to Cache & Redirect)
//   await redisClient.set(shortCode, urlDoc.longUrl, { EX: 3600 });
//   return res.redirect(302, urlDoc.longUrl);
// });

/**
 * @controller  redirectToUrl
 * @desc        Finds a shortCode and redirects to its longUrl.
 * Implements a cache-aside strategy with Redis.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns     {Promise<void>}
 */
export const redirectToUrl = asyncHandler(async (req, res) => {
  const { shortCode } = req.params;

  // --- 1. Check the Cache (Redis) ---
  const cachedUrl = await redisClient.get(shortCode);

  if (cachedUrl) {
    // CACHE HIT: Found in Redis

    // 1. Redirect the user immediately (fast)
    res.redirect(302, cachedUrl);

    // 2. Asynchronously update the click count (accurate)
    // We do NOT await this. It's "fire-and-forget."
    // This runs in the background without slowing the user.
    Url.updateOne({ shortCode }, { $inc: { clicks: 1 } }).exec();

    return; // Exit the function
  }

  // --- 2. Cache Miss: Check the Database (Mongo) ---
  // This is the first-time click, so findOneAndUpdate is perfect.
  const urlDoc = await Url.findOneAndUpdate(
    { shortCode },
    { $inc: { clicks: 1 } } // Increment the 'clicks' field by 1
  );

  // --- 3. Handle Not Found ---
  if (!urlDoc) {
    return res.status(404).json({ message: "Short URL not found" });
  }

  // --- 4. Handle Found (Save to Cache & Redirect) ---
  // We found it, save it to Redis for next time
  await redisClient.set(shortCode, urlDoc.longUrl, { EX: 3600 });

  // And redirect this user
  return res.redirect(302, urlDoc.longUrl);
});

/**
 * @controller  getAllLinks
 * @desc        Get all URLs with selected fields for analytics
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns     {Promise<void>}
 */
export const getAllLinks = asyncHandler(async (req, res) => {
  // Find all URLs
  // .select() allows us to pick which fields to return.
  // We explicitly *exclude* _id and __v
  const links = await Url.find()
    .sort({ createdAt: "asc" })
    .select("longUrl shortCode clicks createdAt -_id");

  res.status(200).json(links);
});
