function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server error' });
}

module.exports = { errorHandler };

