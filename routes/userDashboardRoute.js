const express = require("express");
const router = express.Router();

// Controllers Imports
const {
    getDailyReportData,
    getOverallReportData,
    getTemplateReportData,
    GetLimitandbalance,
    GetBalancepermessage
} = require("../controllers/userDashboardController");

// Rotues
router.get("/getDailyReportData", getDailyReportData);
router.get("/getOverallReportData", getOverallReportData);
router.get("/getTemplateReportData", getTemplateReportData);
router.get("/GetLimitandbalance/:iid", GetLimitandbalance);
router.get("/GetBalancepermessage/:iid", GetBalancepermessage);

module.exports = router;
