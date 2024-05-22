const axios = require("axios");
const conn = require("../DB/connection");
const { setWabaCred } = require("./userController");
const status = require("../assets/js/status");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");

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
    console.log("table new");
    const sql = `SELECT * FROM ${data.table} WHERE ${data.paramstr} AND apikey = '${data.apikey}`;
    console.log(sql);
    conn.query(sql, (err, result) => {
      if (err)
        return callback(
          Object.assign(status.internalservererror(), { error: err })
        );
      // if (err) return callback(status.internalservererror());
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
  const email = req.body.email;
  const password = req.body.password;
  const rememberme = req.body.rememberme;
  console.log(
    "email : ",
    email,
    "password : ",
    password,
    "new : ",
    req.body.type
  );
  if (email && password && email != undefined && password != undefined) {
    console.log("1");
    tableData(
      {
        table: "instance",
        paramstr: `userName = '${email}' --`,
        apikey: apikey,
      },
      (result) => {
        if (result.status_code == 500) {
          return res.send(
            console.log("result : ", result),
            Object.assign(status.internalservererror(), {
              error: {
                detail: `Internal Server Error | Try again after some time`,
              },
            })
          );
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
            const wabaCred = setWabaCred(result[0].apikey, email);
            const wabaCredString = JSON.stringify(wabaCred);
            res.cookie("wabaCred", wabaCredString, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production", // Set the secure flag in production
              maxAge: 24 * 60 * 60 * 1000, // Cookie expiry time in milliseconds (1 day)
            });
            if (rememberme == "true") {
              res.cookie("email", email, { maxAge: 1000 * 60 * 60 * 24 * 15 });
            }
            return res.send(
              Object.assign(status.ok(), {
                data: {
                  detail: `Login Successful`,
                  apikey: result[0].apikey,
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
      }
    );
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

module.exports = { SignIn };
