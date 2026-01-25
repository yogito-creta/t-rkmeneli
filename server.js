const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

let reports = [], announcements = [], templates = [];
let onlineCount = 0;

app.use(bodyParser.urlencoded({ extended: true }));
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Rotalar
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));
app.get('/sohbet', (req, res) => res.sendFile(path.join(__dirname, 'sohbet.html')));
// Diğer get rotalarını (auth, admin vb.) önceki kodundaki gibi koru...

// Socket.io Sohbet Mantığı
io.on('connection', (socket) => {
    onlineCount++;
    io.emit('update-online', onlineCount);

    socket.on('send-msg', (data) => {
        // Mesajı herkese gönder (isim, metin, varsa dosya)
        io.emit('new-msg', data);
    });

    socket.on('disconnect', () => {
        onlineCount--;
        io.emit('update-online', onlineCount);
    });
});

// Admin Giriş (Şifre: admin)
app.post('/admin-login', (req, res) => {
    if (req.body.username === "admin" && req.body.password === "admin") res.redirect('/admin-panel');
    else res.send("<script>alert('Hata!'); window.location='/dashboard';</script>");
});

server.listen(port, "0.0.0.0", () => {
    console.log(`Sistem aktif: ${port}`);
});


