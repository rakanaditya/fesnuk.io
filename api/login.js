// api/login.js
import { dbPromise, initDB } from '../db.js';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  await initDB();
  const db = await dbPromise;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Metode tidak diizinkan.' });
  }

  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', async () => {
    try {
      const { username, password } = JSON.parse(body);

      if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });
      }

      const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

      if (!user) {
        return res.status(404).json({ success: false, message: 'Akun tidak ditemukan.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Password salah.' });
      }

      // Sukses login
      return res.status(200).json({
        success: true,
        message: 'Login berhasil.',
        user: { id: user.id, username: user.username }
      });

    } catch (err) {
      console.error('Login error:', err.message);
      return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat login.' });
    }
  });
}
