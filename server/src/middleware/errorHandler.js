/**
 * Centralized error handling middleware.
 * Catches unhandled errors, formats a standard JSON response, and prevents server crashes.
 */
export function errorHandler(err, req, res, next) {
  console.error('🔥 Server Error:', err);

  // Prisma invalid ObjectId or not found error
  if (err.code === 'P2025' || err.code === 'P2023') {
    return res.status(404).json({
      success: false,
      message: 'Document not found or invalid document ID'
    });
  }

  // Handle explicit status codes or default to 500
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || undefined
  });
}
