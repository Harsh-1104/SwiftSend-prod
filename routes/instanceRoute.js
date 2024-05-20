const express = require("express");
const router = express.Router();

// Controllers Imports
const {
    getallInstance
} = require("../controllers/instanceController");

// Rotues
router.get("/getallInstance", getallInstance);

module.exports = router;
