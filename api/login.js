// api/login.js
import { dbPromise, initDB } from '../db.js';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  await initDB();
  const db = await dbPromise;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Metode tidak diizinkan.' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });
  }

  try {
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Akun tidak ditemukan.' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ success: false, message: 'Password salah.' });
    }

    return res.status(200).json({ success: true, message: 'Login berhasil.', user: { username: user.username } });
  } catch (err) {
    console.error('Error saat login:', err.message);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat login.' });
  }
}
