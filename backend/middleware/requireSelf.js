const requireSelf = (req, res, next) =>
  req.params.id === req.user.id
    ? next()
    : res.status(403).json({ message: "Access denied" });

module.exports = requireSelf;