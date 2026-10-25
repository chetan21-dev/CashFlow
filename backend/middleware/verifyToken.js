const { verifyAccessToken } = require("../utils/jwt");

const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided" });
  }

  try {
    req.user = verifyAccessToken(header.split(" ")[1]); // { id, email, account_number }
    next();
  } catch (err) {
    const expired = err.name === "TokenExpiredError";
    res.status(401).json({
      message: expired ? "Token expired" : "Invalid token",
      code: expired ? "TOKEN_EXPIRED" : "TOKEN_INVALID",
    });
  }
};

module.exports = verifyToken;