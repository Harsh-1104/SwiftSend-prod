const axios = require("axios");

//Credentials

const wabaPhoneID = process.env.WABA_PHONEID;
const version = process.env.WABA_VERSION;
const token = process.env.WABA_TOKEN;

// Example controller methods
const getSampleData = (req, res) => {
    res.json({ message: "GET request to the homepage" });
};

const createSampleData = (req, res) => {
    res.json({ message: "POST request to the homepage" });
};

const sendSimpleTextTemplate = async (req, res) => {
    try {
        // Extract data from the request body
        const { to, templateName, components, languageCode } = req.body;

        const filteredComponents = components
            ? components.filter((component) => component !== null)
            : [];

        // Construct the message payload
        const payload = {
            messaging_product: "whatsapp",
            to: to,
            type: "template",
            template: {
                name: templateName,
                language: {
                    code: languageCode,
                },
                components: filteredComponents,
            },
        };

        // console.log("This is my Payload : ", payload);
        const bearerToken = token;

        // Construct headers with the bearer token
        const headers = {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
        };

        try {
            const response = await axios.post(
                `https://graph.facebook.com/v18.0/287947604404901/messages`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${bearerToken}`, // Fix the token format
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("response : ", response.status === 200);
            // const response = {
            //     status: 200
            // }
            if (response.status === 200) {
                // If successful, return a success response
                res.status(200).json({ success: true, message: "Message sent successfully" });
            } else {
                // If unsuccessful, return an error response
                res.status(417).json({ success: false, message: "Failed to send message" });
            }
        } catch (error) {
            console.log("error ", error.response.data.error.error_data.details);
            res.status(417).json({
                success: false,
                message: error.response.data.error.error_data.details,
            });
        }
    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while sending the message",
        });
    }
};

module.exports = {
    getSampleData,
    createSampleData,
    sendSimpleTextTemplate,
};
