const m_user = require('../model/m_user')

module.exports = 
{
  form_login: function (req,res) {
    res.render('auth/form-login',{
      req: req,
    })
  }, //ejs
  proses_login: async function (req,res) {
    // res.send(req.body) untuk cek apakah kekirim

    // ambil inputan username & password dari html
    let form_username = req.body.form_username
    let form_password = req.body.form_password
    // cek ke db, tabel user
    let username_exist = await m_user.get_1_username(form_username)
      if (username_exist.lenght > 0 ) {
        // jika dapat username, maka lakukan pengecekan password
        res.send('lanjut cek password')
      }else{
        // jika tidak ada usernamenya, kita beri info eror + kembali ke login
        res.redirect(`/login?msg=username tidak terdaftar`)
      }
      // jika password cocok, maka redirect ke halam dasboard
      // jika password salah kita beri info eror + kembalikan ke login
  }
}