import { useState } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });

  // Handle Login
  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      router.push('/dashboard'); // Ubah ini ke halaman beranda setelah login
    } else alert('Login gagal: Email atau password salah');
  }

  // Handle Register
  async function handleRegister(e) {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerForm),
    });

    if (res.ok) {
      alert('Pendaftaran berhasil! Silakan login.');
      setIsLogin(true);
    } else alert('Email sudah terdaftar.');
  }

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>{isLogin ? 'Login' : 'Daftar'}</h2>

      {isLogin ? (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            required
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            required
          />
          <br />
          <button type="submit">Login</button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nama"
            value={registerForm.name}
            onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
            required
          />
          <br />
          <input
            type="email"
            placeholder="Email"
            value={registerForm.email}
            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            required
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={registerForm.password}
            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            required
          />
          <br />
          <button type="submit">Daftar</button>
        </form>
      )}

      <br />
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Login'}
      </button>
    </div>
  );
}
