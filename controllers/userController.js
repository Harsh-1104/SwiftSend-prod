const axios = require("axios");
const conn = require("../DB/connection");

const setWabaCred = (apiKey, email) => {
  const query = `SELECT * FROM whatsapp_cred WHERE apiKey = ?`;

  return new Promise((resolve, reject) => {
    conn.query(query, [apiKey, email], (error, results, field) => {
      if (error) {
        return reject(error);
      } else {
        console.log(results[0]);
        resolve(results);
      }
    });
  });
};

module.exports = { setWabaCred };
