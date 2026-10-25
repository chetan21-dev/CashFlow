const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES = "15m",
  REFRESH_TOKEN_DAYS = 7,
} = process.env;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be set in .env");
}

const REFRESH_DAYS = Number(REFRESH_TOKEN_DAYS);
const REFRESH_COOKIE = "refresh_token";

const refreshCookieOptions = {
  httpOnly: true, // JavaScript can't read it, so XSS can't steal it
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "strict",
  path: "/auth", // the browser only sends it to /auth/* routes
  maxAge: REFRESH_DAYS * 24 * 60 * 60 * 1000,
};

const signAccessToken = (payload) =>
  jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });

// jti makes every refresh token unique, even if two are issued in the same second
const signRefreshToken = (customerId) =>
  jwt.sign({ id: String(customerId), jti: crypto.randomUUID() }, REFRESH_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: `${REFRESH_DAYS}d`,
  });

const verifyAccessToken = (token) =>
  jwt.verify(token, ACCESS_TOKEN_SECRET, { algorithms: ["HS256"] });

const verifyRefreshToken = (token) =>
  jwt.verify(token, REFRESH_TOKEN_SECRET, { algorithms: ["HS256"] });

// Only the hash of a refresh token is stored in the DB
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

module.exports = {
  REFRESH_COOKIE,
  REFRESH_DAYS,
  refreshCookieOptions,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
};