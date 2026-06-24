// 404 handler — runs when no route matched.
function notFound(req, res, next) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Generic error handler — must be registered last, after all routes.
function errorHandler(err, req, res, next) {
  console.error('[error]', err.message);
  const status = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
  });
}

module.exports = { notFound, errorHandler };
