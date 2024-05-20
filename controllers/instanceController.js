const conn = require('../DB/connection');
const status = require("../assets/js/status");

const getallInstance = async (req, res) => {
    try {
        const apikey = req.cookies.apikey;
        const q1 = `SELECT * from instance where apikey = '${apikey}' and disabled = 0`;

        conn.query(q1, function (err, result) {
            if (err) return res.status(500).send(status.internalservererror());
            if (result.length <= 0) return res.status(404).send(status.nodatafound());

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
    getallInstance
};