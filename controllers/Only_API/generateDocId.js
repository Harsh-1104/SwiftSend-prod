const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data"); // Make sure to install form-data using npm

const genDocId = async (req, res) => {
  const version = "v19.0";
  const wabaPhoneID = "339990205857574";
  const token =
    "EAAQoCIybcBQBO2ZAI8R23AWaTBfXGjWN8Ge9FjAZA5rNHKmNCpV7JZC653cZB7qW2jSrCDZCV2MMuM0x6jgDhyuFfbvR0GR9B008NKplnXTo2nqtFSq5GsZAbi5ebtsWge0HaqivP2QRKqdcu9VZB6ZCqTQiXa4jzenyK0RxykJrnPrfsBVTAvo3TpKAFwgk6uebbwocereuv4V291p6tQ7LZC8CkiZBm5uMdpseCO";

  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    const uploadedFile = req.files.file;
    const formData = new FormData();
    formData.append("messaging_product", "whatsapp");
    formData.append("file", uploadedFile.data, uploadedFile.name); // Include file name

    const response = await axios.post(
      `https://graph.facebook.com/${version}/${wabaPhoneID}/media`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ...formData.getHeaders(), // Properly set the headers for form-data
        },
      }
    );

    console.log("my file id", response.data.id);
    if (response.data.id) {
      // Optional: delete the file if needed, assuming you save it on the server
      res.status(200).json({
        message: "Media uploaded successfully",
        data: response.data,
      });
    }
  } catch (error) {
    console.error(
      "Error uploading media:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { genDocId };
