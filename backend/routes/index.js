const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/customer", require("./customer"));
router.use("/account", require("./account"));
router.use("/transact", require("./transact"));

module.exports = router;