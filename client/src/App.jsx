import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import StudentRegister from './pages/StudentRegister';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <nav className="nav">
        <Link to="/" className="header">
          <img src="/KTVC-LOGO.png" alt="Kandara College" className="logo-sm" />
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
      <ThemeToggle />
      <footer className="footer">© 2025 Kandara College | Developed by DeeDev Astro Inc</footer>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div className="home-container">
      <div className="hero-content">
        <h1>Welcome to Kandara College Voting System</h1>
        <p className="hero-subtitle">Secure, transparent, and modern student government elections</p>
      </div>
      
      <div className="access-content">
        <div className="access-group">
          <div className="access-icon">🗳️</div>
          <h3>Students</h3>
          <p>Register and vote for your preferred candidates in a secure digital environment</p>
          <div className="row">
            <Link to="/student/register" className="btn btn-primary">Register</Link>
            <Link to="/student/login" className="btn btn-secondary">Login</Link>
          </div>
        </div>
        <div className="access-group">
          <div className="access-icon">⚙️</div>
          <h3>Administrators</h3>
          <p>Manage the voting process, upload candidates, and monitor live results</p>
          <Link to="/admin/login" className="btn btn-primary">Admin Login</Link>
        </div>
      </div>
      
      <div className="benefits-content">
        <h3>Why Choose This Way</h3>
        <div className="benefits-list">
          <div className="benefit-group">
            <i className="fas fa-bolt benefit-icon"></i>
            <h4>Fast</h4>
            <p>Quick and efficient voting process with instant results</p>
          </div>
          <div className="benefit-group">
            <i className="fas fa-eye benefit-icon"></i>
            <h4>Transparent</h4>
            <p>Open and verifiable voting with real-time progress tracking</p>
          </div>
          <div className="benefit-group">
            <i className="fas fa-clock benefit-icon"></i>
            <h4>Timely</h4>
            <p>Scheduled voting periods with automated start and end times</p>
          </div>
        </div>
      </div>
    </div>
  );
}
