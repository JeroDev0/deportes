import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css';
import API_URL from '../../config/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setMsg('If this email exists, a reset link has been sent.');
        
        // Opcional: volver a login después de 3 segundos
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setMsg(data.error || 'Something went wrong.');
      }
    } catch (error) {
      setMsg('Connection error. Please try again.');
      console.error('Forgot password error:', error);
    }

    setLoading(false);
  };

  return (
    <div>
      <h2 className={styles.title}>Reset Password</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      {msg && <p className={styles.msg}>{msg}</p>}

      <div style={{ marginTop: '10px' }}>
        <button onClick={() => navigate('/login')}>Back to Login</button>
      </div>
    </div>
  );
}

export default ForgotPassword;