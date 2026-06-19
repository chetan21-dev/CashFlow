const router = require("express").Router();
const { accountModel } = require("../models/accountModel");
const { transactionModel } = require("../models/transactionModel");

//API to tranfer amount from one account to another
router.post("", async (req, res) => {
  const transactionRequest = req.body;
  const timestamp = new Date().toISOString();
  const senderAccount = await accountModel.findOne({
    account_number: transactionRequest.sender_account_number,
  });
  const receiverAccount = await accountModel.findOne({
    account_number: transactionRequest.receiver_account_number,
  });
  if (senderAccount && senderAccount.balance >= transactionRequest.amount) {
    const updatedSenderAccount = await accountModel.findByIdAndUpdate(
      { _id: senderAccount._id },
      { $inc: { balance: -transactionRequest.amount } },
      { new: true },
    );
    const updatedReceiverAccount = await accountModel.findByIdAndUpdate(
      { _id: receiverAccount._id },
      { $inc: { balance: transactionRequest.amount } },
      { new: true },
    );
    transactionRequest.timestamp = timestamp;
    transactionModel.create(transactionRequest);
    res.status(201).json({
      message: "Amount transferred successfully",
      balance: updatedSenderAccount.balance,
    });
  } else {
    res.status(400).json({
      message: "You have insufficient balance for this transaction",
      balance: senderAccount.balance,
      amount: transactionRequest.amount,
    });
  }
});

module.exports = router;
