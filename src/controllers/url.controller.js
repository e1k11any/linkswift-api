import { nanoid } from "nanoid";
import Url from "../models/Url.js";

/**
 * @controller  shortenUrl
 * @desc        Shortens a long URL and saves it to the database.
 * @param {import('express').Request} req - Express request object.
 * Expects { longUrl: "..." } in req.body.
 * @param {import('express').Response} res - Express response object.
 * @returns     {Promise<void>}
 */
export const shortenUrl = async (req, res) => {
  // We can trust longUrl exists and is valid because the validator middleware ran first!
  const { longUrl } = req.body;

  try {
    // --- 1. Check if URL already exists in DB (Good Practice!) ---
    // We don't want to create 100 short links for the same google.com
    const existingUrl = await Url.findOne({ longUrl });
    if (existingUrl) {
      const baseUrl =
        process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
      const shortUrl = `${baseUrl}/${existingUrl.shortCode}`;

      // Return 200 OK, not 201 Created, because we found an existing one
      return res.status(200).json({ shortUrl });
    }

    // --- 2. If not, generate new Short Code ---
    const shortCode = nanoid(7);

    // --- 3. Save to Database ---
    const newUrl = new Url({
      longUrl,
      shortCode,
    });
    await newUrl.save();

    // --- 4. Create the Full Short URL ---
    const baseUrl =
      process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const shortUrl = `${baseUrl}/${shortCode}`;

    // --- 5. Respond ---
    return res.status(201).json({ shortUrl });
  } catch (error) {
    // Handle potential errors (like a database crash or duplicate shortCode)
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
