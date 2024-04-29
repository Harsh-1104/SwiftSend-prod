const axios = require("axios");

const wabaPhoneID = process.env.WABA_PHONEID;
const version = process.env.WABA_VERSION;
const token = process.env.WABA_TOKEN;

// const sendBulkMessagesIn = async (req, res) => {
//   try {
//     const { numberList, templateName, components, languageCode } = req.body; // Extract values from req.body

//     const filteredComponents = components
//       ? components.filter((component) => component !== null)
//       : [];

//     const bearerToken = token;

//     // Construct headers with the bearer token
//     const headers = {
//       Authorization: `Bearer ${bearerToken}`,
//       "Content-Type": "application/json",
//     };

//     let success = true;

//     // Use Promise.all to await all requests
//     await Promise.all(
//       numberList.map(async (item) => {
//         const payload = {
//           messaging_product: "whatsapp",
//           to: item,
//           type: "template",
//           template: {
//             name: templateName,
//             language: {
//               code: languageCode,
//             },
//             components: filteredComponents,
//           },
//         };

//         try {
//           const response = await axios.post(
//             `https://graph.facebook.com/v18.0/287947604404901/messages`,
//             payload,
//             {
//               headers: {
//                 Authorization: `Bearer ${bearerToken}`, // Fix the token format
//                 "Content-Type": "application/json",
//               },
//             }
//           );

//           console.log("response : ", response.status === 200);

//           if (response.status !== 200) {
//             success = false;
//           }
//         } catch (error) {
//           console.log("error ", error.response);
//           success = false;
//         }
//       })
//     );

//     if (success) {
//       res
//         .status(200)
//         .json({ success: true, message: "Messages sent successfully" });
//     } else {
//       res.status(500).json({
//         success: false,
//         message: "Failed to send one or more messages",
//       });
//     }
//   } catch (error) {
//     console.log("error", error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while sending the messages",
//     });
//   }
// };

const sendBulkMessagesIn = async (req, res) => {
  try {
    const { numberList, templateName, components, languageCode } = req.body; // Extract values from req.body

    const bearerToken = token;

    const batchPayload = [];

    // Create batch payload containing individual requests
    numberList.forEach((item) => {
      const payload = {
        messaging_product: "whatsapp",
        to: item,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: languageCode,
          },
          components: components, // Assuming components are the same for all requests
        },
      };

      batchPayload.push(payload);
    });

    // Send batch request
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/287947604404901/messages`,
      batchPayload,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if all requests were successful
    if (response.status === 200) {
      res.status(200).json({
        success: true,
        message: "Batch messages sent successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send batch messages",
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while sending batch messages",
    });
  }
};

module.exports = {
  sendBulkMessagesIn,
};

module.exports = {
  sendBulkMessagesIn,
};
