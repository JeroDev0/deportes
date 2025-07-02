import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth.js';
import styles from './AuthForm.module.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    const res = await fetch('https://deportes-production.up.railway.app/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      login(data.token, data.user);
      setMsg('Login successful!');
      setTimeout(() => navigate('/'), 1000);
    } else {
      setMsg(data.error || 'Login error');
    }
  };

  return (
    <div>
      <h2 className={styles.title}>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className={styles.input} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className={styles.input} />
        <button type="submit" className={styles.button}>Enter</button>
      </form>
      {msg && <p className={styles.msg}>{msg}</p>}
    </div>
  );
}

export default Login;