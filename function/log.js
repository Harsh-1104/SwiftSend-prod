const status = require("../assets/js/status");
const crypto = require('crypto');  // Ensure crypto is required if it's not already
const conn = require('../DB/connection');  // Ensure you require your database connection module

//log INSERT
function logAPI(api, apikey, iid, type) {
    const logid = `log-${crypto.randomBytes(6).toString("hex")}`;
    conn.query(`insert into log values(?,?,?,?,?,?)`,
        [logid, apikey, iid, api, type, new Date()],
        function (err, res) {
            if (err) {
                return status.internalservererror().status_code;
            } else {
                return status.ok().status_code;
            }
        });
}

module.exports = logAPI;
