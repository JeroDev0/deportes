import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import styles from './AuthForm.module.css';
import API_URL from '../../config/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

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
        setMsg(t('forgot_success'));

        // Opcional: volver a login después de 3 segundos
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setMsg(data.error || t('forgot_error'));
      }
    } catch (error) {
      setMsg(t('forgot_connection'));
      console.error('Forgot password error:', error);
    }

    setLoading(false);
  };

  return (
    <div>
      <h2 className={styles.title}>{t('forgot_title')}</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          name="email"
          placeholder={t('forgot_placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? t('forgot_sending') : t('forgot_btn')}
        </button>
      </form>

      {msg && <p className={styles.msg}>{msg}</p>}

    </div>
  );
}

export default ForgotPassword;