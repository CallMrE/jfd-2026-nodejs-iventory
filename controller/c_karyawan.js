const m_karyawan = require('../model/m_karyawan')
module.exports =
{
    index: async function (req,res) {
        res.render('karyawan/main',{
            data_karyawan: await m_karyawan.get_semua_karyawan()
        })
    },
}