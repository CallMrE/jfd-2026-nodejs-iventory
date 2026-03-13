const express   = require('express')
const app       = express()
const port      = 3000
const passport  = require('passport')
const session   = require('express-session')
const fileUpload    = require('express-fileupload')

const c_beranda = require('./controller/c_beranda')
const c_auth    = require('./controller/c_auth')
const cek_login = c_auth.cek_login
const c_dashboard   = require('./controller/c_dashboard')
const c_master_produk   = require('./controller/c_master_produk')
const c_stok_masuk      = require('./controller/c_stok_masuk')
const c_stok_keluar     = require('./controller/c_stok_keluar')
const c_kartu_stok      = require('./controller/c_kartu_stok')

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60
        // milidetik * detik * menit
        // batas sesson expired:
        // 1000 milidetik * 60 = 1 menit
        // 1 menit * 60 = 1 jam 
    }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use( fileUpload() )

app.use( express.urlencoded({extended:false}) )
app.set('view engine', 'ejs')
app.set('views', './view-html')
app.use(express.static('public'))

app.get('/', c_beranda.index)
app.get('/login', c_auth.form_login)
app.get('/logout', c_auth.logout)
app.post('/auth/proses-login', c_auth.proses_login)

app.get('/dashboard', cek_login, c_dashboard.index)
app.get('/produk', cek_login, c_master_produk.index)
app.get('/produk/detail/:id_pro', cek_login, c_master_produk.detail)
// app.get('/produk/edit', cek_login, c_master_produk.form_edit)
// app.get('/produk/hapus', cek_login, c_master_produk.hapus)
app.get('/produk/create', cek_login, c_master_produk.form_tambah)
app.post('/produk/insert', cek_login, c_master_produk.validasi_insertProduk, c_master_produk.insert)

app.get('/stok-masuk', c_stok_masuk.index)
app.post('/stok-masuk/insert', cek_login, c_stok_masuk.validasi_stok_masuk, c_stok_masuk.insert)

app.get('/stok-keluar', cek_login, c_stok_keluar.index)
app.post('/stok-keluar/insert', cek_login, c_stok_keluar.validasi_stok_keluar, c_stok_keluar.insert)

app.get('/kartu-stok', cek_login, c_kartu_stok.index)
app.get('/kartu-stok/:kode_produk', cek_login, c_kartu_stok.index)

app.listen(port, ()=>{
    console.log(`Aplikasi sudah siap, buka http://localhost:${port}`)
})