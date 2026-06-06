const mongoose = require("mongoose")

const customerSchema = mongoose.Schema({
  first_name: String,
  middle_name: String,
  last_name: String,
  email: String,
  mobile: Number,
  gender: String,
  aadhar_number: String,
  pan_number: String,
  password: String,
});

const customerModel = mongoose.model("customers", customerSchema, "customers");