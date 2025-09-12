export const errorHandler = (err, req, res, next) => {

  // Supabase errors
  if (err.code) {
    return res.status(400).json({
      error: err.message,
      code: err.code,
      details: err.details
    });
  }

  // General errors
  res.status(500).json({
    error: err.message || 'Internal server error'
  });
}
