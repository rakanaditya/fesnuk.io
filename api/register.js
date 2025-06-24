import { dbPromise, initDB } from '../db.js';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  try {
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
    console.log("Raw body:", body); // tambahkan debug log
    const { username, password } = JSON.parse(body);

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });
    }

    const existing = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Username sudah digunakan.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

    return res.status(201).json({ success: true, message: 'Pendaftaran berhasil.' });

  } catch (innerErr) {
    console.error('JSON Parse or DB error:', innerErr); // tampilkan error
    return res.status(500).json({ success: false, message: 'Kesalahan saat mendaftarkan pengguna.' });
  }
});

  } catch (err) {
    console.error('Register Fatal Error:', err);
    return res.status(500).json({ success: false, message: 'Kesalahan server saat inisialisasi.' });
  }
}
