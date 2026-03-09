const {body, query, validationResult} = require('express-validator')
const m_produk      = require('../model/m_produk')
const m_stok_produk = require('../model/m_stok_produk')

module.exports =
{
    index: async function(req,res) {
        res.render('stok-keluar/main', {
            req: req,
            produk: await m_produk.get_semua_produk(),
        })
    },
    validasi_stok_keluar: [
        body('form_qty_keluar')
        .notEmpty().withMessage('Qty tidak boleh kosong')
        .isInt({gt: 0}).withMessage('Qty harus lebih besar dari 0')
        .isInt({max: 10000}).withMessage('Qty maksimal 10.000')
    ],
    insert: async function(req,res) {
        let validasi = validationResult(req)
        // jika validasi gagal
        if (validasi.errors.length > 0) {
            return res.render('stok-keluar/main', {
                req: req,
                produk: await m_produk.get_semua_produk(),
                pesan_validasi_error: validasi.array(),
            })
        }
        try {
            // ambil data ke m_produk yg kodenya adalah sama dengan di form
            let stok_terakhir = await m_stok_produk.get_produk_by_kode(req)
            
            // jika sudah ada produk di db, maka dikurangi
            let stok_terbaru = 0
            if (stok_terakhir.length > 0) {
                stok_terbaru = Number(stok_terakhir[0].stok_sisa) - Number(req.body.form_qty_keluar)
            } else {
                stok_terbaru = -req.body.form_qty_keluar
            }

            // proses insert ke db
            let proses_insert = await m_stok_produk.insert_stok_keluar(req, stok_terbaru)
            if (proses_insert.affectedRows > 0) {
                res.redirect('/stok-keluar?success_msg=berhasil input stok keluar untuk produk '+ req.body.form_kode_barang)
            }
        } catch (error) {
            console.log(error);
            let objek_error = ''
            if (error.sqlMessage) {
                objek_error = error.errno +': '+ error.sqlMessage
            } else {
                objek_error = JSON.stringify(error)
            }
            res.redirect('/stok-keluar?error_msg=' + objek_error)
        }
    }
}