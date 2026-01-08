import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth.js';
import styles from './AuthForm.module.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        login(data.token, data.user);
        setMsg('Login successful!');
        
        let redirectPath;
        
        if (location.state?.from) {
          redirectPath = location.state.from;
        } else {
          switch (data.user.modelType) {
            case 'deportista':
              redirectPath = `/profile/${data.user.id}`;
              break;
            case 'scout':
              redirectPath = `/scout-profile/${data.user.id}`;
              break;
            case 'sponsor':
              redirectPath = `/sponsor-profile/${data.user.id}`;
              break;
            case 'club':
              redirectPath = `/club-profile/${data.user.id}`;
              break;
            default:
              redirectPath = '/';
              break;
          }
        }
        
        setTimeout(() => navigate(redirectPath), 1000);
      } else {
        setMsg(data.error || 'Login error');
      }
    } catch (error) {
      setMsg('Error de conexión. Inténtalo de nuevo.');
      console.error('Login error:', error);
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