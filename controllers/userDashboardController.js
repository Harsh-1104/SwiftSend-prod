const conn = require('../DB/connection');
const status = require("../assets/js/status");

const getDailyReportData = async (req, res) => {
    try {
        const apikey = req.cookies.apikey;
        const q1 = `SELECT combined.instance_id AS iid, i.i_name AS i_name, combined.apikey, SUM(combined.single_message_count) AS single_message_count, SUM(combined.boardcast_count) AS boardcast_count, SUM(combined.single_message_count + combined.boardcast_count) AS total_count FROM (SELECT m.instance_id, m.apikey, COUNT(m.instance_id) AS single_message_count, 0 AS boardcast_count FROM single_message m WHERE m.apikey = '${apikey}' AND DATE(m.time) = CURDATE() GROUP BY m.instance_id, m.apikey UNION ALL SELECT b.instance_id, b.apikey, 0 AS single_message_count, COUNT(b.instance_id) AS boardcast_count FROM boardcast b WHERE b.apikey = '${apikey}' AND DATE(b.time) = CURDATE() GROUP BY b.instance_id, b.apikey) AS combined JOIN instance i ON combined.instance_id = i.instance_id GROUP BY combined.instance_id, i.i_name, combined.apikey;`;

        conn.query(q1, function (err, result) {
            // console.log("E : ", err)
            if (err) return res.status(500).send(status.internalservererror());
            res.status(200).json({
                success: true,
                data: result,
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching data",
            errorMessage: error.response,
        });
    }
}

const getOverallReportData = async (req, res) => {
    try {
        const apikey = req.cookies.apikey;
        const q1 = `SELECT combined.instance_id AS iid, i.i_name AS i_name, combined.apikey, SUM(combined.single_message_count) AS single_message_count, SUM(combined.boardcast_count) AS boardcast_count, SUM(combined.single_message_count + combined.boardcast_count) AS total_count FROM (SELECT m.instance_id, m.apikey, COUNT(m.instance_id) AS single_message_count, 0 AS boardcast_count FROM single_message m WHERE m.apikey = '${apikey}' GROUP BY m.instance_id, m.apikey UNION ALL SELECT b.instance_id, b.apikey, 0 AS single_message_count, COUNT(b.instance_id) AS boardcast_count FROM boardcast b WHERE b.apikey = '${apikey}' GROUP BY b.instance_id, b.apikey) AS combined JOIN instance i ON combined.instance_id = i.instance_id GROUP BY combined.instance_id, i.i_name, combined.apikey;`;

        conn.query(q1, function (err, result) {
            // console.log("E : ", err)
            if (err) return res.status(500).send(status.internalservererror());
            // if (result.length <= 0) return res.send(status.nodatafound());
            res.status(200).json({
                success: true,
                data: result,
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching data",
            errorMessage: error.response,
        });
    }
}

module.exports = {
    getDailyReportData,
    getOverallReportData
};