const router = require("express").Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { customerModel } = require("../models/customerModel");
const { accountModel } = require("../models/accountModel");
const PRIVATE_KEY = process.env.PRIVATE_KEY;

//GET API
router.get("", async (req, res) => {
  const users = await customerModel.find();
  res.send({
    message: "success",
    users,
  });
});

//GET API with query params
router.get("/query", async (req, res) => {
  const id = req.query.id;
  const user = await customerModel.findById(id);
  res.send({
    user,
  });
});

//GET API with path variable
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const user = await customerModel.findById(id);
  if (!user) {
    res.status(404).json({
      message: `User with ${id} not found`,
    });
  }
  res.status(200).json({
    user,
    message: "success",
  });
});

//To register Customer
router.post("/register", async (req, res) => {
  //Query to add the customer into database
  const user = await customerModel.create(req.body);
  console.log("user", user);
  res.status(200).json({
    message: "Data added successfully",
    user,
  });
});

//To register Customer
router.post("/login", async (req, res) => {
  //Query to add the customer into database
  const { email, password } = req.body;
  const customer = await customerModel.findOne({ email }).lean();
  const account = await accountModel.findOne({ email });
  customer['account_number'] = account.account_number
  if (!customer) return res.status(401).json({ error: "Email not found!" });
  if (customer?.password != password) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign(
    {
      _id: customer._id,
      email: customer.email,
      password: customer.password,
    },
    PRIVATE_KEY,
  );
  customer.account_number = account?.account_number
  return res
    .status(200)
    .json({ message: "Customer logged in successfully", token, customer});
});

//PUT API
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const userRequest = req.body;
  //Query to add the user into database
  const user = await customerModel.findOneAndReplace({ _id: id }, userRequest, {
    new: true,
  });
  if (!user) {
    res.status(404).json({
      message: "User not found!",
    });
  }
  res.status(200).json({
    message: "Data updated successfully",
    user,
  });
});

module.exports = router;
