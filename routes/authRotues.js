const express = require("express");
const { SignIn, updatePassword, AdminSignIn } = require("../controllers/authController");
// const upload = require("../middleware/multerConfig");

const router = express.Router();

router.post("/signin", SignIn);
router.post("/adminlogin", AdminSignIn);
router.put("/updatepassword", updatePassword);

module.exports = router;
