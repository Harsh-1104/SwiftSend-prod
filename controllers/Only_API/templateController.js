const axios = require("axios");

const version = "v19.0";
const wabaId = 246175105255027;
const token =
  "EAAQoCIybcBQBO2ZAI8R23AWaTBfXGjWN8Ge9FjAZA5rNHKmNCpV7JZC653cZB7qW2jSrCDZCV2MMuM0x6jgDhyuFfbvR0GR9B008NKplnXTo2nqtFSq5GsZAbi5ebtsWge0HaqivP2QRKqdcu9VZB6ZCqTQiXa4jzenyK0RxykJrnPrfsBVTAvo3TpKAFwgk6uebbwocereuv4V291p6tQ7LZC8CkiZBm5uMdpseCO";

const getTemplateById = async (templateID) => {
  console.log("start");
  if (!templateID) {
    throw new Error("Template ID is required");
  }

  try {
    const response = await axios.get(
      `https://graph.facebook.com/${version}/${templateID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to send message");
    }
  } catch (error) {
    if (error.response) {
      const statusCode = error.response.status;
      if (statusCode === 400 || statusCode === 404 || statusCode === 500) {
        console.log("error ", error);
      }
    }
    console.log("Error ", error.response);
    throw new Error("An error occurred while fetching templates");
  }
};

module.exports = { getTemplateById };
