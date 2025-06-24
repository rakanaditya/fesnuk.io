import { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwt.decode(token);
      setUser(decoded);
    } catch {
      setUser(null);
    }
  }, []);

  if (!user) return <p>Silakan login untuk melihat beranda.</p>;

  return (
    <div>
      <h1>Selamat datang, {user.name}!</h1>
      <p>Ini adalah beranda fesnuk.io 🎉</p>
    </div>
  );
}
