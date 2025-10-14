import { useState } from 'react';
import { AuthAPI } from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';

export default function AdminLogin() {
  const [systemId, setSystemId] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [toast, setToast] = useState(null); // { type: 'success'|'error', text: string }
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken, setRole } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const delay = (ms) => new Promise(r => setTimeout(r, ms));
      const loginPromise = AuthAPI.adminLogin({ systemId, password });
      const [{ data }] = await Promise.all([loginPromise, delay(3500)]);
      setToken(data.token);
      setRole('admin');
      setToast({ type: 'success', text: 'Login successful' });
      navigate('/admin/dashboard');
    } catch (err) {
      setMsg('Invalid credentials');
      setToast({ type: 'error', text: 'Invalid credentials' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>{toast.text}</div>
      )}
      <h2><img src="/KTVC-LOGO.png" alt="KTVC Logo" className="logo-sm" /> <span className="title-orange">Kandara College</span> — Admin Login</h2>
      {msg && <p>{msg}</p>}
      {msg === 'success' && <div className="success">Success</div>}
      <form onSubmit={onSubmit} className="card form">
        <h3 className="form-title">Admin Login</h3>
        <input disabled={loading} placeholder="System ID" value={systemId} onChange={e => setSystemId(e.target.value)} required />
        <input disabled={loading} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>Login {loading && <span className="spinner" />}</button>
      </form>
    </div>
  );
}


