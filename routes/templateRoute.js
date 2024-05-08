const express = require("express");
const router = express.Router();

// Controllers Imports
const {
  getAllTemplate,
  getAllTemplateStatus,
  getAllTemplateID,
  deleteTemplateByID,
} = require("../controllers/templateController");

// Rotues
router.get("/gettemplate", getAllTemplate);
router.get("/getTemplateStatus", getAllTemplateStatus);
router.get("/getTemplateByID/:id", getAllTemplateID);
router.delete("/deleteTemplateByID/:id/:name", deleteTemplateByID);

module.exports = router;
