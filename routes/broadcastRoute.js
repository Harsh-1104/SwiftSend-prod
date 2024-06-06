const express = require("express");
const router = express.Router();

// Controllers Imports
const {
    getallBroadcastData,
    getsingleBroadcastData
} = require("../controllers/broadcastController");

// Rotues
router.get("/getallBroadcastData/:iid", getallBroadcastData);
router.get("/getsingleBroadcastData/:iid/:brodid", getsingleBroadcastData);

module.exports = router;
