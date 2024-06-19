const conn = require("../DB/connection");
const status = require("../assets/js/status");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const crypto = require("crypto");


let obj = [],
    apikey,
    userProfile;

// ----- Cloudinary Config ------
cloudinary.config({
    cloud_name: "dx1ghhk7f",
    api_key: "653234377299131",
    api_secret: "z37qJcan_y9hvTHmdM2ffHrHHIo",
});

// ----- Login Query ------
const tableData = (data, callback) => {
    try {
        const sql = `SELECT * FROM ${data.table} WHERE ${data.paramstr} AND apikey = '${data.apikey}`;
        conn.query(sql, (err, result) => {
            if (err) return callback(Object.assign(status.internalservererror(), { error: err }));
            if (result.length == 0) return callback(status.nodatafound());
            return callback(result);
        });
    } catch (e) {
        console.log(e);
        callback(status.internalservererror());
    }
};

// ----- Setting Cookie ------
function setCookie(res, name, value, days) {
    res.cookie(name, value, { maxAge: 1000 * 60 * 60 * 24 * days });
}

// ----- SignIn Contoller ------
const SignIn = async (req, res) => {

    const { email, password, rememberme, type } = req.body;

    if (email && password && email != undefined && password != undefined) {
        tableData({
            table: "instance",
            paramstr: `username = '${email}' --`,
            apikey: apikey,
        }, (result) => {
            if (result.status_code == 500) {
                return res.send(Object.assign(status.internalservererror(), {
                    error: {
                        detail: `Internal Server Error | Try again after some time`,
                    },
                }));
            }

            if (result.status_code == 404) {
                console.log("this is my result : ", result);
                return res.send(
                    Object.assign(status.unauthorized(), {
                        error: {
                            detail: `Invalid Email`,
                        },
                    })
                );
            }
            if (result.length > 1) {
                return res.send(
                    Object.assign(status.duplicateRecord(), {
                        error: {
                            detail: `Multiple Email found`,
                        },
                    })
                );
            }
            bcrypt.compare(password, result[0].password, (err, match) => {
                if (match) {
                    let usertype = (type === "root") ? 1 : 0;
                    if (usertype !== result[0].isRoot) {
                        return res.send(
                            Object.assign(status.unauthorized(), {
                                error: {
                                    detail: `Invalid User Type`,
                                },
                            })
                        );
                    }
                    setCookie(res, "apikey", result[0].apikey, 1);
                    if (rememberme == "true") {
                        res.cookie("email", email, { maxAge: 1000 * 60 * 60 * 24 * 15 });
                    }
                    return res.send(
                        Object.assign(status.ok(), {
                            data: {
                                detail: `Login Successful`,
                                apikey: result[0].apikey,
                                iid: result[0].instance_id,
                                isRoot: result[0].isRoot,
                            },
                        })
                    );
                } else {
                    return res.send(
                        Object.assign(status.unauthorized(), {
                            error: {
                                detail: `Invalid Password`,
                            },
                        })
                    );
                }
            });
        });
    } else {
        return res.send(
            Object.assign(status.badRequest(), {
                error: {
                    detail: `Invalid / Missing Parameter`,
                },
            })
        );
    }
};

// ----- Update Password ------

const updatePassword = async (req, res) => {
    const api_key = req.cookies.apikey;
    const newpwd = req.body.newpwd;
    if (newpwd) {
        bcrypt.hash(newpwd, 10, (err, hash) => {
            if (err) return res.send("err in bcrypt");
            let query = `UPDATE users SET password = '${hash}' WHERE apikey = '${api_key}'`;
            conn.query(query, (err, result) => {
                if (err || result.affectedRows <= 0) return res.send(status.internalservererror());
                if (result <= 0) return res.send(status.nodatafound());
                let query = `UPDATE instance SET password = '${hash}' WHERE apikey = '${api_key}' and isRoot = 1`;
                conn.query(query, (err, result) => {
                    if (err || result.affectedRows <= 0) return res.send(status.internalservererror());
                    if (result <= 0) return res.send(status.nodatafound());

                    res.send(status.ok());
                });
            });
        });
    }
}

// ----- SignIn Contoller ------
const AdminSignIn = async (req, res) => {

    const { email, password } = req.body;

    if (email && password && email != undefined && password != undefined) {
        tableData({
            table: "admin",
            paramstr: `email = '${email}' --`,
            apikey: apikey,
        }, (result) => {
            if (result.status_code == 500) {
                return res.send(Object.assign(status.internalservererror(), {
                    error: {
                        detail: `Internal Server Error | Try again after some time`,
                    },
                }));
            }

            if (result.status_code == 404) {
                console.log("this is my result : ", result);
                return res.send(
                    Object.assign(status.unauthorized(), {
                        error: {
                            detail: `Invalid Email`,
                        },
                    })
                );
            }
            if (result.length > 1) {
                return res.send(
                    Object.assign(status.duplicateRecord(), {
                        error: {
                            detail: `Multiple Email found`,
                        },
                    })
                );
            }
            bcrypt.compare(password, result[0].password, (err, match) => {
                if (match) {
                    setCookie(res, "apikey", result[0].apikey, 1);
                    return res.send(
                        Object.assign(status.ok(), {
                            data: {
                                detail: `Login Successful`,
                                apikey: result[0].apikey,
                                iid: result[0].instance_id,
                                isRoot: result[0].isRoot,
                            },
                            success: true
                        })
                    );
                } else {
                    return res.send(
                        Object.assign(status.unauthorized(), {
                            error: {
                                detail: `Invalid Password`,
                            },
                        })
                    );
                }
            });
        });
    } else {
        return res.send(
            Object.assign(status.badRequest(), {
                error: {
                    detail: `Invalid / Missing Parameter`,
                },
            })
        );
    }
};

const AddUser = async (req, res) => {
    const id = crypto.randomBytes(16).toString("hex");

    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    const country = req.body.country;
    const state = req.body.state;
    const city = req.body.city;

    if (name && phone && email && password && country && state && name != undefined && phone != undefined && email != undefined &&
        password != undefined && country != undefined && state != undefined) {

        conn.query(`SELECT * FROM instance i WHERE i.username = '${email}' OR phone = '${phone}'`,
            function (err, result) {
                if (err) {
                    return res.status(500).send(Object.assign(status.internalservererror(), {
                        error: {
                            detail: `Internal Server Error | Try again after some time`,
                        },
                    }));
                }

                if (result.length > 0) {
                    return res.status(409).send(Object.assign(status.duplicateRecord(),
                        {
                            error: {
                                detail: `User with this Data Already exists, Check the email or phone number`
                            },
                        }
                    ));
                }

                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        return res.send(Object.assign(status.badRequest(), {
                            error: {
                                detail: `Something went wrong`
                            },
                        }));
                    }

                    conn.query(`INSERT INTO users VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
                        [id, name, email, hash, phone, true, country, state, city, new Date(), null],
                        function (err, result) {
                            if (err || result.affectedRows == 0) {
                                return res.status(500).send(
                                    Object.assign(status.internalservererror(), {
                                        error: {
                                            detail: `Internal Server Error | Try again after some time`,
                                        },
                                    })
                                );
                            }
                            const token = crypto.randomBytes(10).toString("hex");
                            const instanceid = crypto.randomBytes(8).toString("hex");

                            conn.query(`INSERT INTO instance values(?,?,?,?,?,?,?,?,?,?)`,
                                [instanceid, "Main", id, token, new Date(), 1, 0, email, hash, phone],
                                function (error, result) {
                                    if (error) {
                                        return res.status(500).send(Object.assign(status.internalservererror(), {
                                            error: {
                                                detail: `Internal Server Error | Try again after some time`,
                                                message: error
                                            },
                                        }));
                                    }
                                    return res.status(200).send(Object.assign(status.created(), {
                                        data: {
                                            detail: `Instance & User Created.`,
                                            "Instance ID": id,
                                            "Email": email,
                                            apikey: id,
                                        },
                                        success: true
                                    }));
                                }
                            );
                        }
                    );
                });
            });
    }
    else {
        return res.status(500).send(
            Object.assign(status.badRequest(), {
                error: {
                    detail: `Something went wrong OR Invalid / Missing Parameter`,
                },
            })
        );
    }
};

module.exports = { SignIn, updatePassword, AdminSignIn, AddUser };
