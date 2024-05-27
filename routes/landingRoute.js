const express = require("express");
const router = express.Router();

// Controllers Imports
const getinquirydata = require("../controllers/landingController");

// Rotues
router.post("/getInquiryData", getinquirydata);

module.exports = router;
