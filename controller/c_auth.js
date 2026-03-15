const bcrypt = require("bcryptjs");
const m_user = require("../model/m_user");

module.exports = {
  form_registrasi: function (req, res) {
    res.render("auth/form-registrasi", { req: req });
  },
  proses_registrasi: async function (req, res) {
    try {
      let data_baru = {
        username: req.body.form_username,
        password: bcrypt.hashSync(req.body.form_password, 10),
        id_karyawan: req.body.form_id,
        role: req.body.form_role,
      };

      let cek_user = await m_user.get_1_username(data_baru.username);
      if (cek_user.length > 0) {
        return res.redirect("/registrasi?msg=Username sudah ada!");
      }

      await m_user.insert_user(data_baru);
      res.redirect("/login?msg=Pendaftaran berhasil, silakan login");
    } catch (error) {
      res.redirect("/registrasi?msg=Terjadi kesalahan sistem");
    }
  },
  form_login: function (req, res) {
    if (req.session.user) {
      res.redirect("/dashboard");
      return;
    }
    res.render("auth/form-login", {
      req: req,
    }); //ejs
  },
  proses_login: async function (req, res) {
    // res.send(req.body) untuk cek apakah kekirim
    // ambil inputan username & password dari html
    let form_username = req.body.form_username;
    let form_password = req.body.form_password;
    // cek ke db, tabel user
    let username_exist = await m_user.get_1_username(form_username);
    if (username_exist.length > 0) {
      // jika dapat username, maka lakukan pengecekan password
      let password_db = username_exist[0].password;
      // jika password cocok, maka redirect ke halam dasboard
      let password_benar = bcrypt.compareSync(form_password, password_db);
      if (password_benar) {
        req.session.user = username_exist;
        res.redirect("/dashboard");
      } else {
        // jika password salah kita beri info eror + kembalikan ke login
        res.redirect(`/login?msg=password salah`);
      }
    } else {
      // jika tidak ada usernamenya, kita beri info eror + kembali ke login
      res.redirect(`/login?msg=username tidak terdaftar`);
    }
  },
  cek_login: function (req, res, next) {
    if (req.session.user) {
      next();
    } else {
      res.redirect(`/login?msg=sesi sudah berahir silahkan login!`);
    }
  },
  logout: function (req, res) {
    req.session.destroy(function () {
      res.redirect("/login?msg=anda sudah keluar dari aplikasi!");
    });
  },
};
