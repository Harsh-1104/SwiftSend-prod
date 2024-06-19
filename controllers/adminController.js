const conn = require('../DB/connection');
const status = require("../assets/js/status");

const getalluser = async (req, res) => {
    try {
        conn.query(`SELECT * from users`, function (err, result) {
            if (err) return res.status(500).send(status.internalservererror());
            if (result.length <= 0) {
                return res.send(Object.assign(status.ok(), {
                    success: true,
                    data: result,
                }))
            }

            return res.status(200).send({
                success: true,
                data: result,
            });
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching data",
            errorMessage: error.response,
        });
    }
}

const getallinstance = async (req, res) => {
    try {
        conn.query(`SELECT * from instance`, function (err, result) {
            if (err) return res.status(500).send(status.internalservererror());
            if (result.length <= 0) {
                return res.send(Object.assign(status.ok(), {
                    success: true,
                    data: result,
                }))
            }

            return res.status(200).send({
                success: true,
                data: result,
            });
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching data",
            errorMessage: error.response,
        });
    }
}

const deleteuser = async (req, res) => {
    try {
        const apikey = req.params.id;

        conn.query(`SELECT * from users where apikey = '${apikey}'`, function (err, result) {
            if (err) return res.status(500).send(status.internalservererror());
            if (result.length <= 0) {
                return res.status(404).send(Object.assign(status.nodatafound(), {
                    success: false,
                    data: {
                        detail: `Apikey : ${apikey} not found`
                    },
                }))
            }
            conn.query(`DELETE from users WHERE apikey = '${apikey}'`, function (err1, result1) {
                if (err1) return res.status(500).send(status.internalservererror());
                return res.status(200).send({
                    success: true,
                    data: {
                        detail: `User Deleted`
                    },
                });
            });
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching data",
            errorMessage: error.response,
        });
    }
}

const deleteinstance = async (req, res) => {
    try {
        const iid = req.params.id;

        conn.query(`SELECT * from instance where instance_id = '${iid}'`, function (err, result) {
            if (err) return res.status(500).send(status.internalservererror());
            if (result.length <= 0) {
                return res.status(404).send(Object.assign(status.nodatafound(), {
                    success: false,
                    data: {
                        detail: `Instance Id : ${iid} not found`
                    },
                }))
            }
            conn.query(`DELETE from instance WHERE instance_id = '${iid}'`, function (err1, result1) {
                if (err1) return res.status(500).send(status.internalservererror());
                return res.status(200).send({
                    success: true,
                    data: {
                        detail: `Instance Deleted`
                    },
                });
            });
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching data",
            errorMessage: error.response,
        });
    }
}

module.exports = {
    getalluser,
    getallinstance,
    deleteuser,
    deleteinstance
};