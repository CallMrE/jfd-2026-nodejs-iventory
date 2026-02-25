const mysql = require('mysql2')
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jfd_jan2026'
})
db.connect()

module.exports =
{
  get_1_username: function () {
       let sql = mysql.format(
                'SELECT * FROM user WHERE username'
            )
    
            return new Promise( function(resolve,reject) {
                db.query(sql, function(errorSql, hasil) {
                    if (errorSql) {
                        reject(errorSql)
                    } else {
                        resolve(hasil)
                    }
                })
            })
  }
}