const conn = require('../DB/connection');
const status = require("../assets/js/status");
const sendEmail = require("../function/sendEmail");

const getinquirydata = async (req, res) => {
    const { name, email, subject, message, messagebody, acknowledgementbody } = req.body;

    var data = {
        name: name,
        email: email,
        subject: subject,
        message: message,
        messagebody: messagebody,
        acknowledgementbody: acknowledgementbody
    };

    try {
        conn.query(`select * from company where isSet = 1`, function (err, result) {
            if (err || result.length <= 0) return res.send(status.internalservererror());
            if (result.length > 0) {
                const sender = {
                    hostname: `${result[0].hostname}`,
                    port: `${result[0].portnumber}`,
                    email: `${result[0].c_email}`,
                    passcode: `${result[0].passcode}`,
                };
                sendEmail(sender, { to: "20bmiit087@gmail.com", bcc: "" }, subject, messagebody)
                    .then(() => {
                        sendEmail(sender, { to: email, bcc: "" }, "swiftsend - Acknowledgement mail", acknowledgementbody)
                            .then(() => {
                                res.status(200).json({
                                    success: true,
                                    data: result,
                                });
                            })
                            .catch((error) => {
                                res.status(403).json({
                                    success: false,
                                    message: "There was an error in sending the email to client/customer.",
                                    detail: error
                                });
                            });
                    })
                    .catch((error) => {
                        res.status(403).json({
                            success: false,
                            message: "There was an error in sending the email to swiftsend support team.",
                            detail: error
                        });
                    });
            }
        });
    } catch (error) {
        console.log("error: ", error);
    }
}

module.exports = getinquirydata;