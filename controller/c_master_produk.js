const m_produk = require('../model/m_produk')
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
    insert: async function (req,res) {
        try{
            let proses_insert = await m_produk.insert_1_produk(req)
            if (proses_insert.affectedRows > 0) {
           res.redirect('/produk?success_msg=berhasil input produk baru a/n '+ req.body.forrsa_barang)
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
