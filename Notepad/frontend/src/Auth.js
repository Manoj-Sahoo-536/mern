import { useState } from 'react';
import axios from 'axios';

export default function Auth({ onLogin, theme }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const { data } = await axios.post(`http://localhost:5000${endpoint}`, formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const styles = getStyles(theme);

  return (
    <div style={styles.container}>
      <div style={styles.bgGradient}></div>
      <div style={styles.authBox}>
        <h1 style={styles.title}>✨ Notes Keeper</h1>
        <h2 style={styles.subtitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={styles.input}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.btn}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p style={styles.toggle}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => setIsLogin(!isLogin)} style={styles.link}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

const getStyles = (theme) => ({
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  bgGradient: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: theme === 'dark' ? 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' : 'linear-gradient(135deg, #e0e7ff 0%, #f5f3ff 50%, #fce7f3 100%)', zIndex: 0 },
  authBox: { position: 'relative', zIndex: 10, background: theme === 'dark' ? 'rgba(30,30,45,0.9)' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '48px', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', maxWidth: '400px', width: '90%' },
  title: { margin: '0 0 8px 0', fontSize: '32px', fontWeight: '700', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center' },
  subtitle: { margin: '0 0 32px 0', fontSize: '20px', fontWeight: '600', color: theme === 'dark' ? '#fff' : '#000', textAlign: 'center' },
  error: { padding: '12px', background: 'rgba(239,83,80,0.2)', color: '#ef5350', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  input: { padding: '14px 18px', border: theme === 'dark' ? '2px solid rgba(255,255,255,0.1)' : '2px solid rgba(0,0,0,0.1)', borderRadius: '12px', fontSize: '16px', background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: theme === 'dark' ? '#fff' : '#000', outline: 'none' },
  btn: { padding: '14px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 15px rgba(102,126,234,0.4)' },
  toggle: { marginTop: '24px', textAlign: 'center', color: theme === 'dark' ? '#aaa' : '#666', fontSize: '14px' },
  link: { color: '#667eea', cursor: 'pointer', fontWeight: '600' }
});
