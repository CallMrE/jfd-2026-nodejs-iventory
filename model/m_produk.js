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
    get_semua_produk: function() {
        let sql = mysql.format(
            'SELECT * FROM master_produk', []
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
    },
  insert_1_produk: function (req) {
        let sql = mysql.format(
            'INSERT INTO master_produk SET ?',
            [{
                // kolom_sql: form_html
                kode        : req.body.form_kode_barang.toUpperCase(),
                nama        : req.body.form_nama_barang,
                deskripsi   : req.body.form_deskripsi,
            }]
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
  },
}