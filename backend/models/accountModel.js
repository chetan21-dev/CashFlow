const mongoose = require("mongoose");

const accountSchema = {
  name: String,
  email: String,
  account_number: String,
  balance: Number,
};

const accountModel = mongoose.model("accounts", accountSchema, "accounts");

module.exports = { accountModel };
