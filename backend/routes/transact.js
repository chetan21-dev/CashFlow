const router = require("express").Router();
const { accountModel } = require("../models/accountModel");
const { transactionModel } = require("../models/transactionModel");
const verifyToken = require("../middleware/verifyToken");

//API to tranfer amount from one account to another
router.post("/", verifyToken, async (req, res) => {
  try {
    const sender = req.user.account_number;
    const { receiver_account_number, amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    if (sender === Number(receiver_account_number)) {
      return res.status(400).json({ message: "Cannot transfer to your own account" });
    }

    const senderAccount = await accountModel.findOne({ account_number: sender });
    const receiverAccount = await accountModel.findOne({
      account_number: receiver_account_number,
    });

    if (!receiverAccount) {
      return res.status(404).json({ message: "Receiver account not found" });
    }
    if (senderAccount.balance < amount) {
      return res.status(400).json({
        message: "You have insufficient balance for this transaction",
        balance: senderAccount.balance,
      });
    }

    const updatedSender = await accountModel.findByIdAndUpdate(
      senderAccount._id,
      { $inc: { balance: -amount } },
      { new: true }
    );
    await accountModel.findByIdAndUpdate(receiverAccount._id, {
      $inc: { balance: amount },
    });

    await transactionModel.create({
      sender_account_number: sender,
      receiver_account_number: receiverAccount.account_number,
      amount,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({
      message: "Amount transferred successfully",
      balance: updatedSender.balance,
    });
  } catch (err) {
    res.status(500).json({ message: "Transfer failed" });
  }
});


// GET /transact/history  (add your JWT middleware)
router.get("/history", verifyToken, async (req, res) => {
  try {
    const myAccount = Number(req.user.account_number);

    // Pagination from query params: /history?page=1&limit=10
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
    const skip = (page - 1) * limit;

    const filter = {
      $or: [
        { sender_account_number: myAccount },
        { receiver_account_number: myAccount },
      ],
    };

    // Current page rows + total count in parallel
    const [transactions, total] = await Promise.all([
      transactionModel
        .find(filter)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      transactionModel.countDocuments(filter),
    ]);

    const getCounterparty = (t) =>
      t.sender_account_number === myAccount
        ? t.receiver_account_number
        : t.sender_account_number;

    // One query for the names of this page's counterparties
    const numbers = [...new Set(transactions.map(getCounterparty))];
    const accounts = await accountModel
      .find({ account_number: { $in: numbers } })
      .select("account_number name")
      .lean();
    const nameMap = Object.fromEntries(
      accounts.map((a) => [a.account_number, a.name])
    );

    const data = transactions.map((t) => {
      const counterparty = getCounterparty(t);
      return {
        id: t._id,
        counterpartyName: nameMap[counterparty] ?? "Unknown",
        counterpartyAccount: counterparty,
        amount: t.amount,
        date: t.timestamp,
        type: t.sender_account_number === myAccount ? "debit" : "credit",
      };
    });

    res.json({
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch transaction history" });
  }
});

module.exports = router;
