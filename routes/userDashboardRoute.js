const express = require("express");
const router = express.Router();

// Controllers Imports
const {
    getDailyReportData,
    getOverallReportData
} = require("../controllers/userDashboardController");

// Rotues
router.get("/getDailyReportData", getDailyReportData);
router.get("/getOverallReportData", getOverallReportData);

module.exports = router;
