import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import StudentRegister from './pages/StudentRegister';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <nav className="nav">
        <Link to="/" className="header">
          <img src="/KTVC-LOGO.png" alt="Gapsite College" className="logo-sm" />
          <span className="title-orange">Kandara College Voting System</span>
        </Link>
      </nav>
      <div className="container page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
      <footer className="footer">© 2025 Kandara College | Developed by DeeDev Astro Inc</footer>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div className="container">
      <h2>Welcome to Kandara College Voting System</h2>
      <p>Use the navigation to get started.</p>
      <div className="menu-buttons">
        <Link to="/student/register" className="menu-btn">Student Register</Link>
        <Link to="/student/login" className="menu-btn">Student Login</Link>
        <Link to="/admin/login" className="menu-btn">Admin</Link>
      </div>
    </div>
  );
}
