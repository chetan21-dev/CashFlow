const router = require("express").Router();
const { accountModel } = require("../models/accoundModel");
const { generateAccountNumber } = require("../utils/generateAccountNumber");

//API to create new customer account
router.post("", async (req,res) => {
    const account = req.body
    account.balance = 0;
    account.account_number = generateAccountNumber()
    const newAccount = await accountModel.create(account)
    res.status(200).json({
        message : "Account created successfully",
        account_details : newAccount
    })
})

//API to check the customer account balance
router.get("/:account_number", async (req, res) => {
  const customer = await accountModel.findOne({ account_number : req.params.account_number });
  if (!customer) res.status(404).json({ message: "Customer not found!" });
  res.status(200).json({
    message: "success",
    balance: customer.balance,
  });
});

module.exports = router;