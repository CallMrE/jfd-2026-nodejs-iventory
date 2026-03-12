const {body, query, validationResult} = require('express-validator')
const m_produk = require('../model/m_produk')
const moment = require('moment')
const path  = require('path')

let validasi_insertProduk = [
    body('form_kode_barang')
    .notEmpty().withMessage('Kode Barang tidak boleh kosong')
    .isAlphanumeric().withMessage('Kode Barang hanya menerima Huruf & Angka')
    .isLength({min:5, max: 10}).withMessage('Kode Barang harus 10 karakter')
]

module.exports =
{
    index: async function (req,res) {
        res.render('master-produk/main',{
            req: req,
            data_produk: await m_produk.get_semua_produk()
        })
    },
    detil: async function (req,res) {
        res.render('master-produk/detil',{
            req: req,
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
            let foto = req.files.form_upload_foto
            let filename = ''
            if (foto) {
                // ganti nama file asli
                let kode_barang     = req.body.form_kode_barang
                let datetime        = moment().format('YYMMDD_HHmmss')
                let extension_name  = path.extname(foto.name)
                filename            = kode_barang + '-' + datetime + extension_name
                let folder_simpan   = path.join(__dirname, '../public/upload-image', filename)

                // pakai function mv() untuk meletakkan file di suatu folder/direktori
                foto.mv(folder_simpan, async function(errorUpload) {
                    // jika upload gagal
                    if (errorUpload) {
                        return res.status(500).send(errorUpload)
                    }
                })
            }
            let proses_insert = await m_produk.insert_1_produk(req, filename)
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
            res.redirect('/produk/create?error_msg=' + objek_error)
        }
    },
    
}
