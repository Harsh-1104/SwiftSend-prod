const express = require("express");
const router = express.Router();

// Controllers Imports
const {
    getallBroadcastData
} = require("../controllers/broadcastController");

// Rotues
router.get("/getallBroadcastData/:iid", getallBroadcastData);

module.exports = router;
