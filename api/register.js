// api/register.js
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
    const hashed = await bcrypt.hash(password, 10);
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed]);

    return res.status(200).json({ success: true, message: 'Akun berhasil disimpan.' });
  } catch (err) {
    console.error('Error saat mendaftar:', err.message);
    return res.status(400).json({ success: false, message: 'Username sudah digunakan.' });
  }
}
