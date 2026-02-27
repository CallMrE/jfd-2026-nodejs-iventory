const m_produk = require('../model/m_produk')
module.exports =
{
    index: async function (req,res) {
        res.render('master-produk/main',{
            data_produk: await m_produk.get_semua_produk()
        })
    },
}