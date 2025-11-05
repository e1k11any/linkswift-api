import request from "supertest";
import app from "../../src/app.js";
import mongoose from "mongoose";
import Url from "../../src/models/Url.js";
import dotenv from "dotenv"; // <-- IMPORT this

// Load env vars *for the test environment*
dotenv.config(); // <-- CALL this at the very top

// --- Test Setup ---
beforeAll(async () => {
  // Get the URI from env
  const mongoUri = process.env.MONGO_URI;

  // Safety check
  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in your .env file");
  }

  // Connect to the database *before* running tests
  await mongoose.connect(mongoUri);

  // Clear the Url collection before we start
  await Url.deleteMany({});
});

// We need to close the connection after all tests are done
afterAll(async () => {
  await mongoose.disconnect(); // <-- Use disconnect() for a clean exit
});

// --- The Tests ---
describe("POST /api/v1/shorten", () => {
  // Test 1: The "Happy Path"
  it("should create a new short URL", async () => {
    const res = await request(app).post("/api/v1/shorten").send({
      longUrl: "https://www.google.com",
    });

    // 1. Check the Status Code
    expect(res.statusCode).toEqual(201); // 201 Created

    // 2. Check the Response Body
    expect(res.body).toHaveProperty("shortUrl");

    // We'll be more specific about this URL later
    // expect(res.body.shortUrl).toContain('http://linkswift.com/');
  });

  // Test 2: The "Sad Path" (Bad Input)
  it("should return 400 for an invalid URL", async () => {
    const res = await request(app).post("/api/v1/shorten").send({
      longUrl: "not-a-valid-url", // Bad data
    });

    // 1. Check the Status Code
    expect(res.statusCode).toEqual(400); // 400 Bad Request

    // 2. Check the *new* error message structure
    expect(res.body).toHaveProperty("errors");
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors[0]).toHaveProperty(
      "msg",
      "Invalid URL: Must be a valid URL with http or https protocol"
    );
  });

  it("should return rate limit headers", async () => {
    const res = await request(app).post("/api/v1/shorten").send({
      longUrl: "https://www.anotherexample.com",
    });

    // The middleware adds this header
    // VVV UPDATE THIS LINE VVV
    expect(res.headers).toHaveProperty("ratelimit-limit");
  });
});

describe("GET /:shortCode", () => {
  let testShortCode = ""; // We'll store our created short code here

  // Before these tests, we need a URL in the database to find.
  // We'll use our POST endpoint to create one.
  beforeAll(async () => {
    // Clean up just in case
    await Url.deleteMany({});

    // Create a new link to test against
    const res = await request(app).post("/api/v1/shorten").send({
      longUrl: "https://www.wikipedia.org",
    });

    // Extract the short code from the response
    // res.body.shortUrl is "http://localhost:5000/aB3xYq"
    // We just want the "aB3xYq" part
    testShortCode = res.body.shortUrl.split("/").pop();
  });

  // Test 1: The "Happy Path" (Found)
  it("should redirect to the long URL if the short code is valid", async () => {
    const res = await request(app).get(`/${testShortCode}`); // e.g., /aB3xYq

    // 1. Check the Status Code
    expect(res.statusCode).toEqual(302); // 302 Found (Redirect)

    // 2. Check the "Location" header
    expect(res.headers.location).toEqual("https://www.wikipedia.org");
  });

  // Test 2: The "Sad Path" (Not Found)
  it("should return 404 if the short code does not exist", async () => {
    const res = await request(app).get("/nonexistentcode");

    // 1. Check the Status Code
    expect(res.statusCode).toEqual(404); // 404 Not Found
  });
});
