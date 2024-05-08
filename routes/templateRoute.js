const express = require("express");
const router = express.Router();

// Controllers Imports
const {
  getAllTemplate,
  getAllTemplateStatus,
  getAllTemplateID,
  deleteTemplateByID,
  createTemplate,
  getLanguage,
  mediaForTemplate
} = require("../controllers/tamplateController");

// Rotues
router.post("/createtemplate", createTemplate);
router.get("/gettemplate", getAllTemplate);
router.get("/getTemplateStatus", getAllTemplateStatus);
router.get("/getTemplateByID/:id", getAllTemplateID);
router.delete("/deleteTemplateByID/:id/:name", deleteTemplateByID);
router.post("/mediaidfortemplate", mediaForTemplate);

module.exports = router;
