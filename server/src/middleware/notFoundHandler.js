/**
 * Middleware to handle unmatched routes and return a consistent 404 response.
 */
export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
}
