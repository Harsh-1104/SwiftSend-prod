const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const path = require('path');
const status = require("../assets/js/status");

//Credentials
const wabaPhoneID = process.env.WABA_PHONEID;
const version = process.env.WABA_VERSION;
const accessToken = process.env.WABA_TOKEN;

let toPath = __dirname.split('\\').slice(0, -1).join('/');
function createfolder(foldername) {
    try {
        const dirs = foldername.split('/');
        let currentDir = '';

        for (const dir of dirs) {
            if (!fs.existsSync(`${toPath}/assets/upload/${currentDir}`)) {
                if (fs.mkdirSync(`${toPath}/assets/upload/${currentDir}`)) {
                    return status.ok().status_code;
                }
                else {
                    return status.nodatafound().status_code;
                }
            }
            else {
                return status.duplicateRecord().status_code;
            }
        }
        return true;
    } catch (err) {
        // console.log(err);
        return false;
    }
}

function deleteFolder(folderPath) {
    try {
        if (fs.existsSync(`${toPath}/assets/upload/${folderPath}`)) {
            fs.readdirSync(`${toPath}/assets/upload/${folderPath}`).forEach((file) => {
                const currentPath = path.join(`${toPath}/assets/upload/${folderPath}`, file);
                if (fs.lstatSync(currentPath).isDirectory()) {
                    // Recursively delete sub-folders and files
                    deleteFolder(currentPath);
                } else {
                    // Delete file
                    fs.unlinkSync(currentPath);
                }
            });
            // Delete the empty folder
            fs.rmdirSync(`${toPath}/assets/upload/${folderPath}`);
            return true;
        } else {
            // Folder doesn't exist
            return false;
        }
    } catch (err) {
        // console.log(err);
        return false;
    }
}

const uploadMedia = async (req, res) => {
    try {
        console.log("req.files : ", req.files);
        if (!req.files) {
            // console.log("went wrong ", req.body);

            return res.status(400).json({ error: "No file uploaded" });
        }

        let x = createfolder(`wba/`);
        // console.log(x);
        const uploadedFile = req.files.image;
        const uploadPath = `${toPath}/assets/upload/wba/${uploadedFile.name}`;

        uploadedFile.mv(uploadPath, async function (err) {
            if (err) return res.status(500).json({ error: "Internal server error" });

            let filepath = `${toPath}/assets/upload/wba/${uploadedFile.name}`;
            // console.log("filepath : ", filepath);

            const formData = new FormData();
            formData.append("messaging_product", "whatsapp");
            formData.append("file", fs.createReadStream(filepath));

            try {
                // Make request to Facebook Graph API
                const response = await axios.post(`https://graph.facebook.com/${version}/${wabaPhoneID}/media`,
                    formData, {
                    headers: {
                        ...formData.getHeaders(),
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (response.data.id) {
                    // deleteFolder(`wba/`);
                    return res.status(200).json({ success: true, message: "Media uploaded successfully", data: response.data });
                }
            } catch (err) {
                console.log(" err : ", err.response.data);
                return res.status(400).json({ success: false, message: "Invalid File Type. supported type : [image | PDF | XML]" });
            }
        });
    } catch (error) {
        // Handle errors
        // console.error("Error uploading media:", error.response.data);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    uploadMedia,
};