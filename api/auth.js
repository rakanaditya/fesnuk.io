import { dbPromise, initDB } from '../db.js';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  await initDB();
  const db = await dbPromise;

  const { method } = req;
  const { username, password } = req.body;

  if (method === 'POST' && req.url === '/register') {
    const hash = await bcrypt.hash(password, 10);
    try {
      await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash]);
      res.status(200).json({ success: true, message: 'Registrasi berhasil' });
    } catch (err) {
      res.status(400).json({ success: false, message: 'Username sudah digunakan' });
    }
  } else if (method === 'POST' && req.url === '/login') {
    const user = await db.get('SELECT * FROM users WHERE username = ?', username);
    if (!user) return res.status(401).json({ success: false, message: 'User tidak ditemukan' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Password salah' });

    res.status(200).json({ success: true, message: 'Login berhasil' });
  } else {
    res.status(404).end();
  }
}
