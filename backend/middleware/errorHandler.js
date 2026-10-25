const notFound = (req, res) =>
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });

// Express recognises an error handler by its 4 arguments, so keep `next`
const errorHandler = (err, req, res, next) => {
  if (err.name === "CastError") return res.status(400).json({ message: "Invalid id" });
  if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
  if (err.code === 11000) return res.status(409).json({ message: "Record already exists" });

  // HttpError and body-parser errors (bad JSON, body too large) carry a 4xx status
  if (err.status && err.status < 500) return res.status(err.status).json({ message: err.message });

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};

module.exports = { notFound, errorHandler };