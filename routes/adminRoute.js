const express = require("express");
const { getalluser, deleteuser, getallinstance, deleteinstance } = require("../controllers/adminController");

const router = express.Router();

router.get("/getalluser", getalluser);
router.get("/getallinstance", getallinstance);
router.delete("/deleteuser/:id", deleteuser);
router.delete("/deleteinstance/:id", deleteinstance);

module.exports = router;
