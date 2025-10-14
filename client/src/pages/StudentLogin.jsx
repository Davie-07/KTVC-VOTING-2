import { useState } from 'react';
import { AuthAPI } from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';

export default function StudentLogin() {
  const [admissionNumber, setAdmissionNumber] = useState('');
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
      const { data } = await AuthAPI.studentLogin({ admissionNumber: Number(admissionNumber), password });
      setToken(data.token);
      setRole('student');
      setToast({ type: 'success', text: 'Login successful' });
      navigate('/student/dashboard');
    } catch (err) {
      const text = err?.response?.data?.message || 'Login failed. Please check your details and try again.';
      setMsg(text);
      setToast({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>{toast.text}</div>
      )}
      <h2><img src="/KTVC-LOGO.png" alt="KTVC Logo" className="logo-sm" /> <span className="title-orange">Kandara College</span>  Student Login</h2>
      {msg && <p>{msg}</p>}
      {msg === 'success' && <div className="success">Success</div>}
      <form onSubmit={onSubmit} className="card form">
        <h3 className="form-title">Student Login</h3>
        <input disabled={loading} type="number" placeholder="Admission Number" value={admissionNumber} onChange={e => setAdmissionNumber(e.target.value)} required />
        <input disabled={loading} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>
          Login {loading && <span className="spinner" />}
        </button>
      </form>
    </div>
  );
}


