const express = require("express");
const { SignIn } = require("../controllers/authController");
// const upload = require("../middleware/multerConfig");

const router = express.Router();

router.post("/signin", SignIn);

module.exports = router;
