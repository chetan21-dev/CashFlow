const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");
const verifyToken = require("../middleware/verifyToken");
const validate = require("../middleware/validate");
const { transferSchema } = require("../validators/schemas");
const { accountModel } = require("../models/accountModel");
const { transactionModel } = require("../models/transactionModel");

router.use(verifyToken); // every route in this file is protected

// Transfer money from the logged-in user to another account
router.post(
  "/",
  validate(transferSchema),
  asyncHandler(async (req, res) => {
    const sender = Number(req.user.account_number);
    const { receiver_account_number: receiver, amount } = req.body;

    if (sender === receiver) throw new HttpError(400, "Cannot transfer to your own account");

    const receiverAccount = await accountModel.findOne({ account_number: receiver }).lean();
    if (!receiverAccount) throw new HttpError(404, "Receiver account not found");

    // The balance check is part of the debit itself, so two parallel requests can't overdraw
    const updatedSender = await accountModel.findOneAndUpdate(
      { account_number: sender, balance: { $gte: amount } },
      { $inc: { balance: -amount } },
      { new: true }
    );
    if (!updatedSender) throw new HttpError(400, "You have insufficient balance for this transaction");

    try {
      const credit = await accountModel.updateOne({ account_number: receiver }, { $inc: { balance: amount } });
      if (!credit.matchedCount) throw new HttpError(404, "Receiver account not found");
    } catch (err) {
      // The credit failed, so give the money back to the sender
      await accountModel.updateOne({ account_number: sender }, { $inc: { balance: amount } });
      throw err;
    }

    // Money has moved; a logging failure shouldn't turn a successful transfer into an error
    await transactionModel
      .create({
        sender_email: updatedSender.email,
        sender_account_number: sender,
        receiver_account_number: receiver,
        receiver_email: receiverAccount.email,
        amount,
        timestamp: new Date().toISOString(),
      })
      .catch((err) => console.error("Failed to record transaction:", err));

    res.status(201).json({ message: "Amount transferred successfully", balance: updatedSender.balance });
  })
);

// Paginated history of the logged-in user: GET /transact/history?page=1&limit=10
router.get(
  "/history",
  asyncHandler(async (req, res) => {
    const myAccount = Number(req.user.account_number);

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);

    const filter = {
      $or: [{ sender_account_number: myAccount }, { receiver_account_number: myAccount }],
    };

    const [transactions, total] = await Promise.all([
      transactionModel.find(filter).sort({ timestamp: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      transactionModel.countDocuments(filter),
    ]);

    const isDebit = (t) => t.sender_account_number === myAccount;
    const counterparty = (t) => (isDebit(t) ? t.receiver_account_number : t.sender_account_number);

    // One query for the names of this page's counterparties
    const accounts = await accountModel
      .find({ account_number: { $in: [...new Set(transactions.map(counterparty))] } })
      .select("account_number name")
      .lean();
    const nameMap = Object.fromEntries(accounts.map((a) => [a.account_number, a.name]));

    const data = transactions.map((t) => ({
      id: t._id,
      counterpartyName: nameMap[counterparty(t)] ?? "Unknown",
      counterpartyAccount: counterparty(t),
      amount: t.amount,
      date: t.timestamp,
      type: isDebit(t) ? "debit" : "credit",
    }));

    res.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
  })
);

module.exports = router;