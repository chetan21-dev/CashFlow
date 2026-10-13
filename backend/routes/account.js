const router = require("express").Router();
const { accountModel } = require("../models/accountModel");
const { generateAccountNumber } = require("../utils/generateAccountNumber");
const verifyToken = require("../middleware/verifyToken");

//API to create new customer account
router.post("", async (req, res) => {
  const account = req.body;
  account.balance = 0;
  account.account_number = generateAccountNumber();
  const newAccount = await accountModel.create(account);
  res.status(200).json({
    message: "Account created successfully",
    account_details: newAccount,
  });
});

// To Get account details of the logged-in user's 
router.get("/me", verifyToken, async (req, res) => {
  const account = await accountModel
    .findOne({ account_number: Number(req.user.account_number) })
    .select("account_number name balance")
    .lean();

  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  res.status(200).json({
    message: "success",
    account_number: account.account_number,
    name: account.name,
    balance: account.balance,
  });
});

//API to deposit amount to self account
router.post("/:account_number", verifyToken, async (req, res) => {
  if (Number(req.params.account_number) !== Number(req.user.account_number)) {
    return res.status(403).json({ message: "Access denied" });
  }

  const amount = Number(req.body.balance);
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const account = await accountModel.findOneAndUpdate(
    { account_number: req.params.account_number },
    { $inc: { balance: amount } },
    { new: true },
  );
  if (account) {
    res.status(200).json({
      message: "Amount deposited",
      balance: account.balance,
    });
  } else {
    res.status(404).json({
      message: "customer not found!",
    });
  }
});

module.exports = router;
