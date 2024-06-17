const axios = require("axios");
const { getTemplateById } = require("./templateController");
const { setWabaCred } = require("../../controllers/userController");

// Tansfrom Data
const transformResponseData = (data) => {
    // console.log("transform : ", data);
    const transformedData = {
        templateName: data.name,
        language: data.language,
        Header: [],
        body: [],
    };
    let objTemp = {
        templateName: data.name,
        language: data.language,
        header: [],
        body: [],
    };

    data.components.forEach((item) => {
        // console.log("Item = > ", item);

        switch (item.type) {
            case "HEADER":
                // console.log("This is HEADER");
                switch (item.format) {
                    case "TEXT":
                        // console.log("This is an TEXT. ", item);
                        objTemp.header.push(item.example.header_text[0]);

                        break;
                    case "IMAGE":
                        // console.log("This is an TEXT. ", item);
                        // console.log("This is a IMAGE.");
                        objTemp.header.push("Image");

                        break;
                    case "DOCUMENT":
                        //console.log("This is a DOCUMENT.");
                        break;
                    default:
                    // console.log("Unknown citrus fruit.");
                }
                break;
            case "BODY":
                if (item.example) {
                    // console.log("This is a BODY. => ", item.example.body_text[0].length);
                    var bodyLength = item.example.body_text[0].length;

                    for (var i = 0; i < bodyLength; i++) {
                        objTemp.body.push(item.example.body_text[0][i]);
                    }
                }

                break;
            case "FOOTER":
                // console.log("This is an FOOTER.");
                break;
            default:
                console.log("Unknown fruit.");
        }
    });

    return objTemp;
};

//component section

const createComponentPart = (data, paylodReq) => {
    const reqBody = data.body;
    const { to, templateId, header, body, image } = paylodReq;

    let Component = [
        {
            type: "header",
            parameters: [
                {
                    type: "image",
                    image: {
                        link: "http(s)://the-image-url",
                    },
                },
            ],
        },
        ,
        {
            type: "body",
            parameters: [
                {
                    type: "text",
                    text: "text-string",
                },
            ],
        },
    ];

    let components = [];

    Component.forEach((item) => {
        //console.log("item = > ", item.type);
        const compoType = item.type;

        switch (compoType) {
            case "header":
                var headercompo = {
                    type: "header",
                    parameters: [],
                };
                // console.log("header here = > ",);
                headerType = data.header[0];

                if (headerType === "Image") {
                    var obj = {
                        type: "image",
                        image: {
                            id: paylodReq.image,
                        },
                    };
                    // console.log("Header ", obj);
                    headercompo.parameters.push(obj);
                } else {
                    var obj = {
                        type: "text",
                        text: paylodReq.header[0],
                    };
                    // console.log("Header ", obj);
                    headercompo.parameters.push(obj);
                }

                components.push(headercompo);

                break;
            case "body":
                bodyParmsLength = data.body.length;
                var bodyObj = {
                    type: "body",
                    parameters: [],
                };
                //console.log("This is an BODY count .", bodyParmsLength);
                for (var i = 0; i < bodyParmsLength; i++) {
                    // console.log("body => ", paylodReq.body[i]);
                    var bodyParamObj = {
                        type: "text",
                        text: paylodReq.body[i],
                    };

                    // console.log(bodyParamObj);
                    bodyObj.parameters.push(bodyParamObj);
                }
                // console.log("body : ", bodyObj);
                components.push(bodyObj);
                break;
            default:
                console.log("Unknown fruit.");
        }
    });

    console.log("Component : ", components);

    return components;
};

// Send Message
const sendMessage = async (req, res) => {
    try {
        const { to, templateId, header, body, image } = req.body;
        const payloadReq = req.body;

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
        const phoneID = wabaCred[0].phoneID;

        const result = await getTemplateById(templateId, token);
        const headertype = result.components[0].format;

        if (headertype === "IMAGE" || headertype === "DOCUMENT");
        {
            const file = req.files;
        }

        const result2 = transformResponseData(result);

        const { templateName, language } = result2;
        // console.log("result from : ", result2);
        const filteredComponents = createComponentPart(result2, payloadReq);

        const payload = {
            messaging_product: "whatsapp",
            to: to,
            type: "template",
            template: {
                name: templateName,
                language: {
                    code: language,
                },
                components: filteredComponents,
            },
        };
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        try {
            const response = await axios.post(`https://graph.facebook.com/v18.0/${phoneID}/messages`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Fix the token format
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 200) {
                res.status(200).json({
                    success: true,
                    message: "Message sent successfully",
                });
            }
        } catch (error) {
            console.log("error ", error.response);
            res.status(500).json({
                success: false,
                message: "An error occurred while sending the message",
                payload: payload,
            });
        }
    } catch (error) {
        console.log("my error", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while sending the message",
        });
    }
};

module.exports = { sendMessage };
//818563576807921 - Gate in Utility
//1596204707845784 - image
