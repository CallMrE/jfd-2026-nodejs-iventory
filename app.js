const express   = require('express')
const app       = express()
const port      = 3000
const c_beranda = require('./controller/c_beranda')
const c_auth    = require('./controller/c_auth')
const c_dashboard= require('./controller/c_dashboard')


app.use( express.urlencoded({extended:false}) )
app.set('view engine', 'ejs')
app.set('views', './view-html')
app.use(express.static('public'))


app.get('/', c_beranda.index)
app.get('/login', c_auth.form_login)
app.post('/auth/proses-login', c_auth.proses_login)

app.get('/dasboard', c_dashboard.index)

app.listen(port, ()=>{
    console.log(`Aplikasi sudah siap, buka http://localhost:${port}`)
})