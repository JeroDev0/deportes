import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css';
import API_URL from "../../config/api";

function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    profileType: 'atleta',
  });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg('Registration successful! You can now log in.');
        setForm({ email: '', password: '', profileType: 'atleta' });
        
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMsg(data.error || 'Registration error');
      }
    } catch (error) {
      setMsg('Error de conexión. Inténtalo de nuevo.');
      console.error('Registration error:', error);
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
          <option value="scout">Sports Professionals</option>
          <option value="sponsor">Sponsor</option>
          <option value="club">Club</option>
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