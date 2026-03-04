const {body, query, validationResult} = require('express-validator')
const m_produk = require('../model/m_produk')
const moment = require('moment')

let validasi_insertProduk = [
    body('form_kode_barang')
    .notEmpty().withMessage('Kode Barang tidak boleh kosong')
    .isAlphanumeric().withMessage('Kode Barang hanya menerima Huruf & Angka')
    .isLength({min:10, max: 10}).withMessage('Kode Barang harus 10 karakter')
]

module.exports =
{
    index: async function (req,res) {
        res.render('master-produk/main',{
            req: req,
            data_produk: await m_produk.get_semua_produk()
        })
    },
    form_tambah: async function (req,res) {
        res.render('master-produk/form-tambah',{
            req: req,
        })
    },

    validasi_insertProduk,
    
    insert: async function (req,res) {
        let validasi = validationResult(req)
        // jika validasi gagal
        if (validasi.errors.length > 0) {
            return res.render('master-produk/form-tambah', {
                req: req,
                pesan_validasi_error: validasi.array()
            })
        }
        try{
            let proses_insert = await m_produk.insert_1_produk(req)
            if (proses_insert.affectedRows > 0) {
           res.redirect('/produk?success_msg=berhasil input produk baru a/n '+ req.body.form_nama_barang)
            }
        } catch (error) {
            console.log(error);
            let objek_error = ''
            if (error.sqlMessage) {
                objek_error = error.errno +': '+ error.sqlMessage
            } else {
                objek_error = JSON.stringify(error)
            }
            res.redirect('/produk/tambah?error_msg=' + objek_error)
        }
    },
}
