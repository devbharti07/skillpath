export const errorHandler = (err, req, res, next) => {
  console.error('[SkillPath Error Handler]:', err.message || err);

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 && process.env.NODE_ENV === 'production'
    ? 'An unexpected internal server error occurred.'
    : err.message || 'An error occurred while processing your request.';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { details: err.stack ? err.stack.split('\n')[1]?.trim() : undefined })
  });
};
