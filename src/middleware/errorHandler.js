/**
 * Central Error Handler Middleware
 *
 * This middleware catches all errors thrown from async
 * handlers (when wrapped with express-async-handler)
 * and formats a consistent JSON error response.
 */
const errorHandler = (err, req, res, next) => {
  // Use the status code from the error, or default to 500
  const statusCode = err.statusCode || 500;

  console.error(err.stack); // Log the full error stack for debugging

  res.status(statusCode).json({
    message: err.message || "Something went wrong on the server",
    // Only include the stack trace in development mode
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

export default errorHandler;
