const router = require("express").Router();
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const asyncHandler = require("../utils/asyncHandler");
const { customerModel } = require("../models/customerModel");
const { accountModel } = require("../models/accountModel");
const { refreshTokenModel } = require("../models/refreshTokenModel");
const { issueSession, toSafeCustomer } = require("../services/authService");
const {
  REFRESH_COOKIE,
  refreshCookieOptions,
  verifyRefreshToken,
  hashToken,
} = require("../utils/jwt");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts. Try again later." },
});

const checkPassword = async (customer, password) => {
  if (customer.password?.startsWith("$2")) {
    return bcrypt.compare(password, customer.password);
  }
  // Legacy plain-text password: accept it once, then upgrade it to a hash.
  // Delete this branch after all existing users have logged in once.
  if (customer.password === password) {
    await customerModel.updateOne(
      { _id: customer._id },
      { password: await bcrypt.hash(password, 10) }
    );
    return true;
  }
  return false;
};

router.post(
  "/login",
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // Reject objects like { "$ne": null } (NoSQL injection)
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const customer = await customerModel.findOne({ email }).lean();
    // One generic message, so attackers can't tell which emails exist
    if (!customer || !(await checkPassword(customer, password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const account = await accountModel.findOne({ email }).lean();
    if (!account) {
      return res.status(404).json({ error: "No account linked to this customer" });
    }

    const accessToken = await issueSession(res, customer, account);
    res.json({
      message: "Customer logged in successfully",
      accessToken,
      customer: toSafeCustomer(customer, account),
    });
  })
);

// Trades a valid refresh cookie for a new access token (and a new refresh token)
router.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) return res.status(401).json({ message: "No refresh token" });

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    // One-time use: delete it atomically. If it's already gone, it was used or revoked.
    const stored = await refreshTokenModel.findOneAndDelete({ token_hash: hashToken(token) });
    if (!stored) return res.status(401).json({ message: "Refresh token revoked" });

    const customer = await customerModel.findById(payload.id).lean();
    const account = customer && (await accountModel.findOne({ email: customer.email }).lean());
    if (!account) return res.status(401).json({ message: "Account not found" });

    const accessToken = await issueSession(res, customer, account); // rotation
    res.json({ accessToken, customer: toSafeCustomer(customer, account) });
  })
);

router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (token) await refreshTokenModel.deleteOne({ token_hash: hashToken(token) });

    const { maxAge, ...clearOptions } = refreshCookieOptions;
    res.clearCookie(REFRESH_COOKIE, clearOptions);
    res.json({ message: "Logged out" });
  })
);

module.exports = router;