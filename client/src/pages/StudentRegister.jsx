import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthAPI } from '../api';
import { useNavigate } from 'react-router-dom';

export default function StudentRegister() {
  const [form, setForm] = useState({ firstName: '', lastName: '', course: '', admissionNumber: '', password: '', confirmPassword: '', agree: false });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.agree) { setMsg('Please agree to the Terms and Conditions'); return; }
    try {
      setLoading(true);
      const delay = (ms) => new Promise(r => setTimeout(r, ms));
      const payload = { ...form, admissionNumber: Number(form.admissionNumber) };
      await Promise.all([AuthAPI.studentRegister(payload), delay(3500)]);
      setMsg('success');
      navigate('/student/login');
    } catch (err) {
      const m = err?.response?.data?.message || 'Registration failed';
      setMsg(m);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {msg === 'success' ? <div className="success">Success</div> : (msg && <p>{msg}</p>)}
      <form onSubmit={onSubmit} className="card form">
        <h3 className="form-title">Student Voting Registration</h3>
        <input disabled={loading} name="firstName" placeholder="First Name" value={form.firstName} onChange={onChange} required />
        <input disabled={loading} name="lastName" placeholder="Last Name" value={form.lastName} onChange={onChange} required />
        <input disabled={loading} name="course" placeholder="Course" value={form.course} onChange={onChange} required />
        <input disabled={loading} name="admissionNumber" type="number" placeholder="Admission Number (500-9999)" value={form.admissionNumber} onChange={onChange} required />
        <input disabled={loading} name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
        <input disabled={loading} name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={onChange} required />
        <label className="agree">
          <input disabled={loading} type="checkbox" name="agree" checked={form.agree} onChange={onChange} />
          <span style={{ marginLeft: 8 }}>
            I agree to the <button type="button" className="link" onClick={() => setShowTerms(true)}>Terms and Conditions</button>
          </span>
        </label>
        <button type="submit" disabled={loading}>Register {loading && <span className="spinner" />}</button>
        <p style={{ textAlign: 'center', margin: 0 }}>
          Already have an account? <Link to="/student/login" className="link">Login</Link>
        </p>
      </form>
      {showTerms && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Terms and Conditions">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Terms and Conditions</h3>
              <button type="button" className="close" onClick={() => setShowTerms(false)} aria-label="Close">×</button>
            </div>
            <div className="modal-body">
              <ul>
                <li>You will use your account to vote only once.</li>
                <li>You will not violate or go against voting rules.</li>
              </ul>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={() => setShowTerms(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


