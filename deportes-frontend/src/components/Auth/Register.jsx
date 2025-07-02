import { useState } from 'react';
import styles from './AuthForm.module.css';

function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    profileType: 'atleta', // default
  });
  const [msg, setMsg] = useState('');

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');

    const res = await fetch('http://localhost:5000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      setMsg('Registration successful! You can now log in.');
      setForm({ email: '', password: '', profileType: 'atleta' });
    } else {
      setMsg(data.error || 'Registration error');
    }
  };

  return (
    <div>
      <h2 className={styles.title}>Register</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <select
          name="profileType"
          value={form.profileType}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="atleta">Athlete</option>
          <option value="scout">Scout</option>
          <option value="sponsor">Sponsor</option>
        </select>
        <button type="submit" className={styles.button}>
          Register
        </button>
      </form>
      {msg && <p className={styles.msg}>{msg}</p>}
    </div>
  );
}

export default Register;