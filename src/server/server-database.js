// const checkUser = require('../client/js/check-user.js')
// const userLogin = require("../client/js/check-user.js")

// ===================== CONNECT DB ===================

// get the client
const mysql = require('mysql2')

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


// ================================ SEARCHING USERS IN DB ===================================

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



// WHERE login = ?', [userLogin],

//
// function searchUser() {
//
// }
//
// module.exports = {
//   searchUser
// }