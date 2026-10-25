const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");
const verifyToken = require("../middleware/verifyToken");
const validate = require("../middleware/validate");
const { depositSchema } = require("../validators/schemas");
const { accountModel } = require("../models/accountModel");
const { generateAccountNumber } = require("../utils/generateAccountNumber");

// ───────── Public (the Register page calls this before the user can log in) ─────────
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, email } = req.body;
    if (typeof name !== "string" || typeof email !== "string") {
      throw new HttpError(400, "Name and email are required");
    }
    if (await accountModel.exists({ email })) {
      throw new HttpError(409, "Account already exists for this email");
    }

    // Only the fields we expect are saved, and balance always starts at 0
    const account = await accountModel.create({
      name,
      email,
      balance: 0,
      account_number: generateAccountNumber(),
    });
    res.status(201).json({ message: "Account created successfully", account_details: account });
  })
);

// ───────── Protected ─────────
router.use(verifyToken);

// Details of the logged-in user's own account
router.get(
  "/me",
  asyncHandler(async (req, res) => {
    const account = await accountModel
      .findOne({ account_number: Number(req.user.account_number) })
      .select("account_number name balance")
      .lean();
    if (!account) throw new HttpError(404, "Account not found");

    res.json({
      message: "success",
      account_number: account.account_number,
      name: account.name,
      balance: account.balance,
    });
  })
);

// Deposit into your own account
router.post(
  "/:account_number",
  validate(depositSchema),
  asyncHandler(async (req, res) => {
    if (Number(req.params.account_number) !== Number(req.user.account_number)) {
      throw new HttpError(403, "Access denied");
    }

    // The account comes from the token, not from the URL
    const account = await accountModel.findOneAndUpdate(
      { account_number: Number(req.user.account_number) },
      { $inc: { balance: req.body.balance } },
      { new: true }
    );
    if (!account) throw new HttpError(404, "Account not found");

    res.json({ message: "Amount deposited", balance: account.balance });
  })
);

module.exports = router;