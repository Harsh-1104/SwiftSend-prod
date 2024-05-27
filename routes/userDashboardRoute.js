const express = require("express");
const router = express.Router();

// Controllers Imports
const {
    getDailyReportData,
    getOverallReportData,
    getTemplateReportData
} = require("../controllers/userDashboardController");

// Rotues
router.get("/getDailyReportData", getDailyReportData);
router.get("/getOverallReportData", getOverallReportData);
router.get("/getTemplateReportData", getTemplateReportData);

module.exports = router;
