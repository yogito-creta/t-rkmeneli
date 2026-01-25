const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

let reports = [];

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));

// Rotalar
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/auth', (req, res) => res.sendFile(path.join(__dirname, 'auth.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));
app.get('/pixel-rapor', (req, res) => res.sendFile(path.join(__dirname, 'pixel-rapor.html')));
app.get('/admin-panel', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('/duyurular', (req, res) => res.sendFile(path.join(__dirname, 'duyurular.html')));
app.get('/sablonlar', (req, res) => res.sendFile(path.join(__dirname, 'sablonlar.html')));

// Giriş Mantığı
app.post('/login-first', (req, res) => {
    if (req.body.password === "şifre") res.redirect('/auth');
    else res.send("<script>alert('Yanlış Şifre!'); window.location='/';</script>");
});

// Admin Giriş (Şifre: ucler)
app.post('/admin-login', (req, res) => {
    if (req.body.username === "admin" && req.body.password === "ucler") {
        res.redirect('/admin-panel');
    } else {
        res.send("<script>alert('Yetkisiz Giriş!'); window.location='/dashboard';</script>");
    }
});

app.post('/submit-report', upload.single('photo'), (req, res) => {
    reports.push({
        user: req.body.username || "Anonim",
        text: req.body.message,
        image: req.file ? req.file.buffer.toString('base64') : null
    });
    res.send("<script>alert('Rapor Gönderildi!'); window.location='/dashboard';</script>");
});

app.get('/get-reports', (req, res) => res.json(reports));

app.listen(port, () => console.log(`Port: ${port}`));
