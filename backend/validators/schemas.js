const { z } = require("zod");

const money = z.coerce
  .number()
  .positive("Amount must be greater than 0")
  .max(1000000, "Maximum amount is ₹10,00,000")
  .refine((v) => Math.abs(v * 100 - Math.round(v * 100)) < 1e-6, "Maximum 2 decimal places");

const accountNumber = z.coerce.number().int().positive("Enter a valid account number");

const transferSchema = z.object({ receiver_account_number: accountNumber, amount: money });
const depositSchema = z.object({ balance: money }); // the frontend sends `balance`

module.exports = { transferSchema, depositSchema };