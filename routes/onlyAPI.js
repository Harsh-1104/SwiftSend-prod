const express = require("express");
const { genDocId } = require("../controllers/Only_API/generateDocId");
const { sendMessage } = require("../controllers/Only_API/messageController");
// const upload = require("../middleware/multerConfig");

const router = express.Router();

router.post("/gendocid", genDocId);
router.post("/sendmessage", sendMessage);

module.exports = router;
