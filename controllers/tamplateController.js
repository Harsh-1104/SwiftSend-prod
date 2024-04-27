const axios = require("axios");

const wabaPhoneID = process.env.WABA_PHONEID;
const version = process.env.WABA_VERSION;
const token = process.env.WABA_TOKEN;
const wabaId = process.env.WABA_ID;

// Removing example from the Template Data
const cleanTemplatesData = (data) => {
  return data.map((template) => {
    const cleanedComponents = template.components.map((component) => {
      const { example, ...cleanedComponent } = component;
      return cleanedComponent;
    });
    return { ...template, components: cleanedComponents };
  });
};

// Getting Status Data .

//------------------------------------------- Get all template -----------------------------------------------
const getAllTemplate = async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/${version}/${wabaId}/message_templates`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);
    const newData = cleanTemplatesData(response.data.data);

    if (response.status === 200) {
      res.status(200).json({
        success: true,
        message: "Message sent successfully",
        data: newData,
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to send message" });
    }
  } catch (error) {
    console.error("Error occurred while fetching templates:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching templates",
    });
  }
};

//------------------------------------------- Get All Template Status ----------------------------------------
const getAllTemplateStatus = async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/${version}/${wabaId}/message_templates`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = response.data;

    // Check if responseData is an array
    if (Array.isArray(responseData)) {
      // Handle the case where responseData is an array
      const filteredData = responseData.map((template) => {
        const { name, language, status, category, id } = template;
        return { name, language, status, category, id };
      });

      console.log(filteredData); // Log filtered data here

      res.status(200).json({
        success: true,
        message: "Message sent successfully",
        data: filteredData,
      });
    } else if (responseData.data && Array.isArray(responseData.data)) {
      // Handle the case where responseData contains a data property which is an array
      const filteredData = responseData.data.map((template) => {
        const { name, language, status, category, id } = template;
        return { name, language, status, category, id };
      });

      console.log(filteredData); // Log filtered data here

      res.status(200).json({
        success: true,
        message: "Message sent successfully",
        data: filteredData,
      });
    } else {
      console.error("Unexpected response structure:", responseData);
      res.status(500).json({
        success: false,
        message: "Unexpected response structure",
        responseData: responseData,
      });
    }
  } catch (error) {
    console.error("Error occurred while fetching templates:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching templates",
      errorMessage: error.response,
    });
  }
};

//------------------------------------------- Get Template By ID ---------------------------------------------
const getAllTemplateID = async (req, res) => {
  const templateID = req.params.id;
  if (!templateID) {
    return res
      .status(400)
      .json({ success: false, message: "Template ID is required" });
  }

  let decodedId;
  try {
    decodedId = Buffer.from(templateID, "base64").toString("ascii");
  } catch (error) {
    console.error("Error decoding ID:", error);
    return res
      .status(400)
      .json({ success: false, message: "Invalid template ID" });
  }

  try {
    const response = await axios.get(
      `https://graph.facebook.com/${version}/${decodedId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const responseData = response.data;
    if (response.status === 200) {
      res.status(200).json({
        success: true,
        message: "Message sent successfully",
        data: responseData,
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to send message" });
    }
  } catch (error) {
    if (error.response) {
      const statusCode = error.response.status;
      if (statusCode === 400 || statusCode === 404 || statusCode === 500) {
        return res.status(statusCode).json({
          success: false,
          message: "Error from Facebook API",
          errorMessage: error.response.data,
        });
      }
    }
    console.error("Error occurred while fetching templates:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching templates",
      errorMessage: error.response,
    });
  }
};

//------------------------------------------- Create Template -------------------------------------------------

const createTemplate = async (req, res) => {};

//-------------------------------------------- Delete Template -------------------------------------------------
const deleteTemplateByID = async (req, res) => {
  const templateID = req.params.id;
  const templateName = req.params.name;

  console.log("This is my name and ID : ", templateID, templateName);
  if (!templateID) {
    return res
      .status(400)
      .json({ success: false, message: "Template ID is required" });
  }

  let decodedId;
  try {
    decodedId = Buffer.from(templateID, "base64").toString("ascii");
  } catch (error) {
    console.error("Error decoding ID:", error);
    return res
      .status(400)
      .json({ success: false, message: "Invalid template ID" });
  }

  try {
    const response = await axios.delete(
      `https://graph.facebook.com/${version}/${wabaId}/message_templates?hsm_id=${decodedId}&name=${templateName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const responseData = response.data;
    console.log("this is my data : ", responseData);
    if (response.status === 200) {
      res.status(200).json({
        success: true,
        message: "Template Deleted Successfully",
        data: responseData,
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to send message" });
    }
  } catch (error) {
    if (error.response) {
      const statusCode = error.response.status;
      if (statusCode === 400 || statusCode === 404 || statusCode === 500) {
        return res.status(statusCode).json({
          success: false,
          message: "Error from Facebook API",
          errorMessage: error.response.data,
        });
      }
    }
    console.error("Error occurred while fetching templates:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching templates",
      errorMessage: error.response.error_user_title,
    });
  }
};

module.exports = {
  getAllTemplate,
  getAllTemplateStatus,
  getAllTemplateID,
  deleteTemplateByID,
};
