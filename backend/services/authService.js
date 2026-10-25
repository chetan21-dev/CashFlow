const { refreshTokenModel } = require("../models/refreshTokenModel");
const {
  REFRESH_COOKIE,
  REFRESH_DAYS,
  refreshCookieOptions,
  signAccessToken,
  signRefreshToken,
  hashToken,
} = require("../utils/jwt");

// Creates both tokens, saves the refresh token hash, sets the cookie, returns the access token
const issueSession = async (res, customer, account) => {
  const accessToken = signAccessToken({
    id: String(customer._id),
    email: customer.email,
    account_number: account.account_number,
  });

  const refreshToken = signRefreshToken(customer._id);
  await refreshTokenModel.create({
    customer_id: customer._id,
    token_hash: hashToken(refreshToken),
    expires_at: new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000),
  });

  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
  return accessToken;
};

// Customer data that is safe to send to the browser (no password)
const toSafeCustomer = (customer, account) => {
  const { password, ...rest } = customer;
  return { ...rest, account_number: account.account_number };
};

module.exports = { issueSession, toSafeCustomer };