const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
  {
    customer_id: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    token_hash: { type: String, required: true, unique: true },
    expires_at: { type: Date, required: true },
  },
  { timestamps: true }
);

// MongoDB deletes expired rows automatically
refreshTokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

const refreshTokenModel = mongoose.model("refresh_token", refreshTokenSchema);
module.exports = { refreshTokenModel };