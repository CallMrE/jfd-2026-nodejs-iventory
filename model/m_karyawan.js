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
  get_semua_karyawan: function () {
       let sql = mysql.format(
                'SELECT * FROM karyawan',[]
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