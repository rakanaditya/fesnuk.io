import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPromise = open({
  filename: './data.db',
  driver: sqlite3.Database,
});

const initDB = async () => {
  const db = await dbPromise;
  await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
};

export { dbPromise, initDB };
