import { openDB } from '../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, password } = req.body;
  const db = await openDB();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);

  const hashed = await bcrypt.hash(password, 10);

  try {
    await db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, hashed]);
    res.status(200).json({ message: 'User registered' });
  } catch {
    res.status(500).json({ message: 'Email already used' });
  }
}
