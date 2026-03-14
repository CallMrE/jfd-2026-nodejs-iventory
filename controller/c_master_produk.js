const {
  body,
  query,
  validationResult,
  ExpressValidator,
} = require("express-validator");
const m_produk = require("../model/m_produk");
const moment = require("moment");
const path = require("path");

let validasi_insertProduk = [
  body("form_kode_barang")
    .notEmpty()
    .withMessage("Kode Barang tidak boleh kosong")
    .isAlphanumeric()
    .withMessage("Kode Barang hanya menerima Huruf & Angka")
    .isLength({ min: 5, max: 10 })
    .withMessage("Kode Barang harus 10 karakter"),
];

module.exports = {
  index: async (req, res) => {
    res.render("master-produk/main", {
      req: req,
      data_produk: await m_produk.get_semua_produk(),
    });
  },
  detail: async (req, res) => {
    let id_pro = req.params.id_pro;
    res.render("master-produk/detail-produk", {
      req: req,
      detail_produk: await m_produk.get_1_produk(id_pro),
    });
  },
  form_tambah: async (req, res) => {
    res.render("master-produk/form-tambah", {
      req: req,
    });
  },
  form_edit: async (req, res) => {
    let id_pro = req.params.id_pro;
    res.render("master-produk/form-edit", {
      req: req,
      detail_produk: await m_produk.get_1_produk(id_pro),
    });
  },
  validasi_insertProduk,
  insert: async (req, res) => {
    let validasi = validationResult(req);
    // jika validasi gagal
    if (validasi.errors.length > 0) {
      return res.render("master-produk/form-tambah", {
        req: req,
        pesan_validasi_error: validasi.array(),
      });
    }
    try {
      let foto = req.files.form_upload_foto;
      let filename = "";
      if (foto) {
        // ganti nama file asli
        let kode_barang = req.body.form_kode_barang;
        let datetime = moment().format("YYMMDD_HHmmss");
        let extension_name = path.extname(foto.name);
        filename = kode_barang + "-" + datetime + extension_name;
        let folder_simpan = path.join(
          __dirname,
          "../public/upload-image",
          filename,
        );

        // pakai function mv() untuk meletakkan file di suatu folder/direktori
        foto.mv(folder_simpan, async function (errorUpload) {
          // jika upload gagal
          if (errorUpload) {
            return res.status(500).send(errorUpload);
          }
        });
      }
      let proses_insert = await m_produk.insert_1_produk(req, filename);
      if (proses_insert.affectedRows > 0) {
        res.redirect(
          "/produk?success_msg=berhasil input produk baru a/n " +
            req.body.form_nama_barang,
        );
      }
    } catch (error) {
      console.log(error);
      let objek_error = "";
      if (error.sqlMessage) {
        objek_error = error.errno + ": " + error.sqlMessage;
      } else {
        objek_error = JSON.stringify(error);
      }
      res.redirect("/produk/create?error_msg=" + objek_error);
    }
  },

  proses_update: async (req, res) => {
    let validasi = validationResult(req);
    // jika validasi gagal
    if (validasi.errors.length > 0) {
      return res.render("master-produk/form-edit", {
        req: req,
        pesan_validasi_error: validasi.array(),
      });
    }
    try {
      let id_pro = req.params.id_pro;
      let foto_lama = detail_produk[0].foto; // Ambil nama file lama dari DB
      let foto = req.files && req.files.form_upload_foto;
      let filename = foto_lama; // Default gunakan foto lama
      let detail_produk = await m_produk.get_1_produk(id_pro);
      // Cek apakah ada file baru yang diunggah
      if (foto) {
        let kode_barang = req.body.form_kode_barang;
        let foto = req.files.form_upload_foto;
        let datetime = moment().format("YYMMDD_HHmmss");
        let extension_name = path.extname(foto.name);
        filename = kode_barang + "-" + datetime + extension_name;
        let folder_simpan = path.join(
          __dirname,
          "../public/upload-image",
          filename,
        );

        // Proses upload file baru
        await foto.mv(folder_simpan);
      }

      // Jalankan update dengan filename (baru atau lama)
      let proses_update = await m_produk.update_1_produk(req, filename);

      if (proses_update.affectedRows > 0) {
        res.redirect(
          "/produk?success_msg=berhasil update data produk a/n " +
            req.body.form_nama_barang,
        );
      }
    } catch (error) {
      console.log(error);
      res.redirect(`/produk/edit/${req.params.id_pro}?error_msg=Gagal update`);
    }
  },
  hapus: async (req, res) => {
    let id_pro = req.params.id_pro;
    let data_produk = await m_produk.get_1_produk(id_pro);
    let nama = data_produk[0].nama;

    let proses_hapus = await m_produk.delete_1_produk(id_pro);

    if (proses_hapus[1].affectedRows > 0) {
      res.redirect(
        "/produk?success_msg=berhasil hapus data produk a/n " + nama,
      );
    }
  },
};
