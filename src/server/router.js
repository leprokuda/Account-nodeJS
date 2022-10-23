const express = require('express');
const mysql = require("mysql2");
const {request} = require("express");
const router = express.Router();
router.use(express.static(__dirname));
const jsonParser = express.json();

router.get('/', (_request, response) => {
  response.sendFile(`${__dirname}/html/index.html`);
});

async function checkUser(request) {
  // ===================== CONNECT DB ===================

// create the connection to database
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'maliServ1',
    database: 'first-base'
  });

  connection.connect( err => {
    if (err) {
      console.log(err)
      return err
    } else {
      console.log('------------------CONNECTED-----------------')
    }
  })
  async function searchUser() {
    connection.query(
      'SELECT login FROM `users`',
      function checkUsers(err, results, fields) {
        if (err) {
          console.log(err)
        } else {
          console.log(results)
        }
      }
    );
  }
}
checkUser()