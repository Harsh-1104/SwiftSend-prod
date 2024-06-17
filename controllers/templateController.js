const axios = require("axios");
const { setWabaCred } = require("../controllers/userController");


const version = process.env.WABA_VERSION;


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
    const email = req.cookies.email;
    const apiKey = req.cookies.apikey;
    const iid = req.params.iid;
    const wabaCred = await setWabaCred(apiKey, iid);

    if (wabaCred.length <= 0) {
      return res.status(404).json({
        success: false,
        message: "An error occurred while fetching templates",
        detail: "Instance not found"
      });
    }

    const token = wabaCred[0].permanentToken;
    const wabaId = wabaCred[0].wabaID;
    const phoneID = wabaCred[0].phoneID;
    const appID = wabaCred[0].appID;


    const response = await axios.get(
      `https://graph.facebook.com/${version}/${wabaId}/message_templates`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const newData = cleanTemplatesData(response.data.data);
      res.status(200).json({
        success: true,
        data: newData,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching templates",
      });
    }
  } catch (error) {
    console.log("error : ", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching templates",
    });
  }
};

//------------------------------------------- Get All Template Status ----------------------------------------
const getAllTemplateStatus = async (req, res) => {
  try {
    const email = req.cookies.email;
    const apiKey = req.cookies.apikey;

    const wabaCred = await setWabaCred(apiKey, email);

    if (wabaCred.length <= 0) {
      return res.status(404).json({
        success: false,
        message: "An error occurred while fetching templates",
        detail: "Instance not found"
      });
    }

    const token = wabaCred[0].permanentToken;
    const wabaId = wabaCred[0].wabaID;
    const phoneID = wabaCred[0].phoneID;
    const appID = wabaCred[0].appID;

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

      res.status(200).json({
        success: true,
        data: filteredData,
      });
    } else if (responseData.data && Array.isArray(responseData.data)) {
      // Handle the case where responseData contains a data property which is an array
      const filteredData = responseData.data.map((template) => {
        const { name, language, status, category, id } = template;
        return { name, language, status, category, id };
      });

      res.status(200).json({
        success: true,
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
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching templates",
      errorMessage: error.response,
    });
  }
};

//------------------------------------------- Get Template By ID ---------------------------------------------
const getAllTemplateID = async (req, res) => {
  const email = req.cookies.email;
  const apiKey = req.cookies.apikey;

  const wabaCred = await setWabaCred(apiKey, email);

  if (wabaCred.length <= 0) {
    return res.status(404).json({
      success: false,
      message: "An error occurred while fetching templates",
      detail: "Instance not found"
    });
  }

  const token = wabaCred[0].permanentToken;
  const wabaId = wabaCred[0].wabaID;
  const phoneID = wabaCred[0].phoneID;
  const appID = wabaCred[0].appID;

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
        data: responseData,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching templates",
        errorMessage: error.response,
      });
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
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching templates",
      errorMessage: error.response,
    });
  }
};

//------------------------------------------- Create Template -------------------------------------------------

const createTemplate = async (req, res) => {
  try {
    const apiKey = req.cookies.apikey;
    const { name, language, category, components, iid } = req.body;

    const wabaCred = await setWabaCred(apiKey, iid);

    if (wabaCred.length <= 0) {
      return res.status(404).json({
        success: false,
        message: "An error occurred while fetching templates",
        detail: "Instance not found"
      });
    }

    const token = wabaCred[0].permanentToken;
    const wabaId = wabaCred[0].wabaID;
    const phoneID = wabaCred[0].phoneID;
    const appID = wabaCred[0].appID;

    // Extract data from the request body

    const filteredComponents = components
      ? components.filter((component) => component !== null)
      : [];

    // Construct the message payload
    const payload = {
      name: name,
      language: language,
      category: category,
      components: components,
    };

    console.log("This is my Payload : ", payload);
    const bearerToken = token;

    // Construct headers with the bearer token
    const headers = {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(
        `https://graph.facebook.com/${version}/${wabaId}/message_templates`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Fix the token format
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response : ", response.status === 200);

      if (response.status === 200) {
        // If successful, return a success response
        res
          .status(200)
          .json({ success: true, message: "Template created successfully" });
      } else {
        // If unsuccessful, return an error response
        res
          .status(406)
          .json({ success: false, message: "Failed to create a Template" });
      }
    } catch (error) {
      console.log("error ", error.response.data);
      res.status(406).json({
        success: false,
        message: "An error occurred while creating the template",
      });
    }
  } catch (error) {
    console.log("this is my error", error.data);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the templatee",
    });
  }
};

//-------------------------------------------- Delete Template -------------------------------------------------
const deleteTemplateByID = async (req, res) => {
  const templateID = req.params.id;
  const templateName = req.params.name;
  const iid = req.params.iid;

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
    const email = req.cookies.email;
    const apiKey = req.cookies.apikey;

    const wabaCred = await setWabaCred(apiKey, iid);

    if (wabaCred.length <= 0) {
      return res.status(404).json({
        success: false,
        message: "An error occurred while fetching templates",
        detail: "Instance not found"
      });
    }

    const token = wabaCred[0].permanentToken;
    const wabaId = wabaCred[0].wabaID;
    const phoneID = wabaCred[0].phoneID;
    const appID = wabaCred[0].appID;

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
//-------------------------------------------- For media Template -------------------------------------------------
const mediaForTemplate = async (req, res) => {
  const email = req.cookies.email;
  const apiKey = req.cookies.apikey;
  const iid = req.body.iid;

  const wabaCred = await setWabaCred(apiKey, iid);

  if (wabaCred.length <= 0) {
    return res.status(404).json({
      success: false,
      message: "An error occurred while fetching templates",
      detail: "Instance not found"
    });
  }

  const token = wabaCred[0].permanentToken;
  const wabaId = wabaCred[0].wabaID;
  const phoneID = wabaCred[0].phoneID;
  const appID = wabaCred[0].appID;

  console.log("req file : ", req.files);
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    // Access uploaded file using the correct key
    const uploadedFile = req.files.file;

    // Handle the uploaded file as needed
    const fileSize = uploadedFile.size;
    const fileType = uploadedFile.mimetype;
    const fileData = uploadedFile.data;

    console.log("Uploaded file details:", uploadedFile);

    const response1 = await axios.post(
      `https://graph.facebook.com/${version}/${appID}/uploads?file_length=${fileSize}&file_type=${fileType}`,
      fileData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": fileType, // Set content type explicitly
        },
      }
    );

    const secretKey = response1.data.id;

    console.log("Secret Key:", secretKey);

    // Make the second API call
    const response2 = await axios.post(
      `https://graph.facebook.com/${version}/${secretKey}`,
      fileData, // Send the file data to the second API
      {
        headers: {
          Authorization: `OAuth ${token}`,
          "Content-Type": fileType, // Set content type explicitly
        },
      }
    );

    console.log("Response from second API:", response2.data);

    res.status(200).json({
      success: true,
      message: "Media uploaded successfully ",
      data: response2.data,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getAllTemplate,
  getAllTemplateStatus,
  getAllTemplateID,
  deleteTemplateByID,
  createTemplate,
  mediaForTemplate,
};
