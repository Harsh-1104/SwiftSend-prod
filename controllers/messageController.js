const axios = require("axios");
const crypto = require("crypto");
const conn = require('../DB/connection');

//Credentials

const wabaPhoneID = process.env.WABA_PHONEID;
const version = process.env.WABA_VERSION;
const token = process.env.WABA_TOKEN;

// Function to insert data into single_message table
const insertIntoSingleMessage = async (apikey, templateName, Single_id, iid) => {
    const query = `INSERT INTO single_message (single_id, apikey, template_name, time, instance_id) VALUES (?, ?, ?, CURRENT_TIMESTAMP,?)`;
    const values = [Single_id, apikey, templateName, iid];

    return new Promise((resolve, reject) => {
        conn.query(query, values, (error, results, fields) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results.insertId);
        });
    });
};

// Function to insert data into message_info table
const insertIntoMessageInfo = async (data) => {
    const query = `INSERT INTO message_info (waba_message_id, single_id, reciver_number, message_type, status) VALUES (?, ?, ?, ?, ?)`;
    const values = [
        data.waba_message_id,
        data.single_id,
        data.reciver_number,
        data.message_type,
        data.status,
    ];

    return new Promise((resolve, reject) => {
        conn.query(query, values, (error, results, fields) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
};

const sendSimpleTextTemplate = async (req, res) => {
    try {
        const Single_id = crypto.randomBytes(16).toString("hex");
        const apikey = req.cookies.apikey;
        // Extract data from the request body
        const { to, templateName, components, languageCode, iid } = req.body;

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
                // Insert into single_message table
                const singleMessageId = await insertIntoSingleMessage(
                    apikey,
                    templateName,
                    Single_id,
                    iid
                );

                console.log("A : ", response)
                console.log("B : ", response.data)

                const myData = response.data;
                // Insert into message_info table
                const messageId = myData.messages[0].id;
                console.log("contact : ", messageId);
                const messageTypeInfo = {
                    waba_message_id: messageId,
                    single_id: Single_id,
                    apikey: apikey,
                    reciver_number: to,
                    message_type: "single",
                    status: "sent",
                };

                console.log("this my my payload :  ", messageTypeInfo);

                await insertIntoMessageInfo(messageTypeInfo);
                res.status(200).json({ success: true, message: "Message sent successfully" });
            } else {
                res.status(417).json({ success: false, message: "Failed to send message" });
            }
        } catch (error) {
            console.log("error ", error);
            res.status(417).json({
                success: false,
                message: error,
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
    sendSimpleTextTemplate,
};
