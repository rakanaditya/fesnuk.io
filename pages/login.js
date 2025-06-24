import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      router.push('/');
    } else alert('Login gagal');
  }

  return (
    <form onSubmit={handleLogin}>
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} required />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} required />
      <button type="submit">Login</button>
    </form>
  );
}
