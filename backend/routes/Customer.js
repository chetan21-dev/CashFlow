const router = require("express").Router();
const bcrypt = require("bcryptjs");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");
const verifyToken = require("../middleware/verifyToken");
const requireSelf = require("../middleware/requireSelf");
const { customerModel } = require("../models/customerModel");

// ───────── Public ─────────
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { first_name, middle_name, last_name, gender, email, mobile, pan_number, aadhaar_number, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      throw new HttpError(400, "Email and password are required");
    }
    if (await customerModel.exists({ email })) {
      throw new HttpError(409, "Email is already registered");
    }

    const user = await customerModel.create({
      first_name, middle_name, last_name, gender, email, mobile, pan_number, aadhaar_number,
      password: await bcrypt.hash(password, 10),
    });

    const { password: _removed, ...safeUser } = user.toObject();
    res.status(201).json({ message: "Data added successfully", user: safeUser });
  })
);

// ───────── Protected: everything below needs a valid access token ─────────
console.log("verifyToken is:", typeof verifyToken, verifyToken);
router.use(verifyToken);

router.get(
  "/:id",
  requireSelf,
  asyncHandler(async (req, res) => {
    const user = await customerModel.findById(req.params.id).select("-password");
    if (!user) throw new HttpError(404, "User not found");
    res.json({ message: "success", user });
  })
);

router.put(
  "/:id",
  requireSelf,
  asyncHandler(async (req, res) => {
    const { first_name, middle_name, last_name, gender, mobile } = req.body;
    const user = await customerModel
      .findByIdAndUpdate(req.params.id, { first_name, middle_name, last_name, gender, mobile }, { new: true })
      .select("-password");
    if (!user) throw new HttpError(404, "User not found");
    res.json({ message: "Data updated successfully", user });
  })
);

module.exports = router;