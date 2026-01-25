const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Veriler (RAM'de tutulur, sunucu kapanınca silinir)
let reports = [];
let announcements = [];
let templates = [];

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// SAYFALAR
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/auth', (req, res) => res.sendFile(path.join(__dirname, 'auth.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));
app.get('/pixel-rapor', (req, res) => res.sendFile(path.join(__dirname, 'pixel-rapor.html')));
app.get('/admin-panel', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('/duyurular', (req, res) => res.sendFile(path.join(__dirname, 'duyurular.html')));
app.get('/sablonlar', (req, res) => res.sendFile(path.join(__dirname, 'sablonlar.html')));

// GİRİŞ & RAPOR SİSTEMİ
app.post('/login-first', (req, res) => {
    if (req.body.password === "şifre") res.redirect('/auth');
    else res.send("<script>alert('Yanlış Şifre!'); window.location='/';</script>");
});

app.post('/admin-login', (req, res) => {
    if (req.body.username === "admin" && req.body.password === "ucler") res.redirect('/admin-panel');
    else res.send("<script>alert('Yetkisiz Giriş!'); window.location='/dashboard';</script>");
});

app.post('/submit-report', upload.single('photo'), (req, res) => {
    reports.push({ id: Date.now(), user: req.body.username, text: req.body.message, image: req.file ? req.file.buffer.toString('base64') : null });
    res.send("<script>alert('Rapor Gönderildi!'); window.location='/dashboard';</script>");
});

// ADMİN İŞLEMLERİ (PAYLAŞMA VE SİLME)
app.post('/admin/add-announcement', upload.single('photo'), (req, res) => {
    announcements.push({ id: Date.now(), text: req.body.text, image: req.file ? req.file.buffer.toString('base64') : null });
    res.redirect('/admin-panel');
});

app.post('/admin/add-template', upload.single('photo'), (req, res) => {
    templates.push({ id: Date.now(), text: req.body.text, image: req.file ? req.file.buffer.toString('base64') : null });
    res.redirect('/admin-panel');
});

app.get('/admin/delete-announcement/:id', (req, res) => {
    announcements = announcements.filter(a => a.id != req.params.id);
    res.redirect('/admin-panel');
});

app.get('/admin/delete-template/:id', (req, res) => {
    templates = templates.filter(t => t.id != req.params.id);
    res.redirect('/admin-panel');
});

// VERİ ÇEKME
app.get('/api/reports', (req, res) => res.json(reports));
app.get('/api/announcements', (req, res) => res.json(announcements));
app.get('/api/templates', (req, res) => res.json(templates));

app.listen(port, () => console.log(`Server running on ${port}`));
