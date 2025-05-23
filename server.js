const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Gagal membaca users.json:', err);
      return res.status(500).json({ message: 'Server error saat membaca data user.' });
    }

    let users = [];
    try {
      users = JSON.parse(data);
    } catch (parseErr) {
      console.error('Gagal parsing users.json:', parseErr);
      return res.status(500).json({ message: 'Format users.json tidak valid.' });
    }

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      console.log(`Login gagal untuk username: ${username}`);
      return res.status(401).json({ message: 'Username atau password salah.' });
    }

    console.log(`Login berhasil untuk username: ${username}, role: ${user.role}`);
    res.json({ message: 'Login berhasil', role: user.role });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});