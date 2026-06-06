const router = require("express").Router();
const { accountModel } = require("../models/accoundModel");
const { generateAccountNumber } = require("../utils/generateAccountNumber");

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

//API to check the customer account balance
router.get("/:account_number", async (req, res) => {
  const customer = await accountModel.findOne({
    account_number: req.params.account_number,
  });
  if (!customer) res.status(404).json({ message: "Customer not found!" });
  res.status(200).json({
    message: "success",
    balance: customer.balance,
  });
});

//API to deposit amount to self account
router.post("/:account_number", async (req, res) => {
  const { balance } = req.body;
  const account = await accountModel.findOneAndUpdate(
    { account_number: req.params.account_number },
    { $inc: { balance: balance } },
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
