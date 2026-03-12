const m_stok_produk = require("../model/m_stok_produk")

module.exports =
{
    index: async function (req,res) {
        res.render('./dashboard/main',{
            req: req,
            stok_terakhir: await m_stok_produk.get_stok_terakhir_semua_produk(),
        })
    },
}