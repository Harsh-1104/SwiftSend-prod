const conn = require('../DB/connection');
const status = require("../assets/js/status");

const getallBroadcastData = async (req, res) => {
    try {
        const apikey = req.cookies.apikey;
        const iid = req.params.iid;
        const q1 = `SELECT mi.reciver_number,mi.boardCast_id,mi.status, b.template_id, b.time FROM message_info mi INNER JOIN boardcast b ON mi.boardCast_id = b.boardCast_id  WHERE b.apikey = '${apikey}' AND b.instance_id = '${iid}' ORDER BY b.time DESC`;

        conn.query(q1, function (err, result) {
            if (err) return res.status(500).send(status.internalservererror());
            if (result.length <= 0) return res.status(404).send(status.nodatafound());
            const filteredresult = result.reduce((acc, curr) => {
                let broadcastEntry = acc.find(entry => entry.boardCast_id === curr.boardCast_id);

                // If it doesn't exist, create a new entry
                if (!broadcastEntry) {
                    broadcastEntry = {
                        boardCast_id: curr.boardCast_id,
                        template_id: curr.template_id,
                        time: curr.time,
                        broadcast: []
                    };
                    acc.push(broadcastEntry);
                }

                // Add the phone and status to the broadcast array of the corresponding broadcast_id
                broadcastEntry.broadcast.push({ phone: curr.reciver_number, status: curr.status });

                return acc;
            }, []);
            res.status(200).json({
                success: true,
                data: filteredresult,
                // data: result,
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
    getallBroadcastData
};