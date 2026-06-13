const mongoose = require("mongoose")

const transactionSchema = {
    sender_email: String,
    sender_account_number: Number,
    receiver_account_number : Number,
    receiver_email : String,
    amount : Number,
    timestamp : String
}

const transactionModel = mongoose.model("transactions", transactionSchema, "transactions")

module.exports = { transactionModel }