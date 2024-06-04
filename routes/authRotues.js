const express = require("express");
const { SignIn, updatePassword } = require("../controllers/authController");
// const upload = require("../middleware/multerConfig");

const router = express.Router();

router.post("/signin", SignIn);
router.put("/updatepassword", updatePassword);

module.exports = router;
