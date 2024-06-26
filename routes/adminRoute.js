const express = require("express");
const {
    getalluser, deleteuser, getallinstance, deleteinstance, updateInstancestatus, gettransferdata, updateMaininstance, getallusercred, addwabacred, deleteCREDRecord, getallmessage
} = require("../controllers/adminController");

const router = express.Router();

router.get("/getalluser", getalluser);
router.get("/getallinstance", getallinstance);
router.get("/gettransferdata", gettransferdata);
router.get("/getallusercred", getallusercred);
router.get("/getallmessage", getallmessage);

router.post("/addwabacred", addwabacred);

router.delete("/deleteuser/:id", deleteuser);
router.delete("/deleteinstance/:id", deleteinstance);
router.delete("/deletecredrecord/:id", deleteCREDRecord);

router.put("/updateInstancestatus", updateInstancestatus);
router.put("/updatemaininstance", updateMaininstance);

module.exports = router;
