import { dbPromise, initDB } from '../db.js';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  await initDB();
  const db = await dbPromise;

  if (req.method === 'POST' && req.url === '/register') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Data tidak lengkap.' });
    }

    try {
      const hashed = await bcrypt.hash(password, 10);
      await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed]);
      return res.status(200).json({ success: true, message: 'Akun berhasil disimpan.' });
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Username sudah digunakan.' });
    }
  }

  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan.' });
}
