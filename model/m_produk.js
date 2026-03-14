const mysql = require("mysql2");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "jfd_jan2026",
  multipleStatements: true,
});
db.connect();

module.exports = {
  get_semua_produk: function () {
    let sql = mysql.format("SELECT * FROM master_produk", []);
    return new Promise(function (resolve, reject) {
      db.query(sql, function (errorSql, hasil) {
        if (errorSql) {
          reject(errorSql);
        } else {
          resolve(hasil);
        }
      });
    });
  },
  get_1_produk: function (id_pro) {
    let sql = mysql.format("SELECT * FROM master_produk WHERE id = ?", [
      id_pro,
    ]);
    return new Promise(function (resolve, reject) {
      db.query(sql, function (errorSql, hasil) {
        if (errorSql) {
          reject(errorSql);
        } else {
          resolve(hasil);
        }
      });
    });
  },
  insert_1_produk: function (req, filename) {
    let sql = mysql.format("INSERT INTO master_produk SET ?", [
      {
        // kolom_sql: form_html
        kode: req.body.form_kode_barang.toUpperCase(),
        nama: req.body.form_nama_barang.toUpperCase(),
        deskripsi: req.body.form_deskripsi,
        foto: filename ? filename : null,
      },
    ]);
    return new Promise(function (resolve, reject) {
      db.query(sql, function (errorSql, hasil) {
        if (errorSql) {
          reject(errorSql);
        } else {
          resolve(hasil);
        }
      });
    });
  },
  update_1_produk: function (req, filename) {
    let sql = mysql.format("UPDATE master_produk SET ? WHERE id=?", [
      {
        // kolom_sql: form_html
        kode: req.body.form_kode_barang.toUpperCase(),
        nama: req.body.form_nama_barang.toUpperCase(),
        deskripsi: req.body.form_deskripsi,
        foto: filename,
      },
      req.params.id_pro,
    ]);
    return new Promise(function (resolve, reject) {
      db.query(sql, function (errorSql, hasil) {
        if (errorSql) {
          reject(errorSql);
        } else {
          resolve(hasil);
        }
      });
    });
  },
  delete_1_produk: function (id_pro) {
    let sql = mysql.format(
      "INSERT INTO master_produk_hapus SELECT * FROM master_produk WHERE id = ? ; DELETE FROM master_produk WHERE id=?",
      [id_pro, id_pro],
    );
    return new Promise(function (resolve, reject) {
      db.query(sql, function (errorSql, hasil) {
        if (errorSql) {
          reject(errorSql);
        } else {
          resolve(hasil);
        }
      });
    });
  },
};
