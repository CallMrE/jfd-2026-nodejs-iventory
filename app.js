const express   = require('express')
const app       = express()
const port      = 3000
const passport  = require('passport')
const session   = require('express-session')

const c_beranda = require('./controller/c_beranda')
const c_auth    = require('./controller/c_auth')
const cek_login = c_auth.cek_login
const c_dashboard= require('./controller/c_dashboard')
const c_master_produk   = require('./controller/c_master_produk')

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

app.use( express.urlencoded({extended:false}) )
app.set('view engine', 'ejs')
app.set('views', './view-html')
app.use(express.static('public'))


app.get('/', c_beranda.index)
app.get('/login', c_auth.form_login)
app.post('/auth/proses-login', c_auth.proses_login)

app.get('/dashboard', cek_login, c_dashboard.index)
app.get('/produk', cek_login, c_master_produk.index)

app.listen(port, ()=>{
    console.log(`Aplikasi sudah siap, buka http://localhost:${port}`)
})