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
    <div className="container">
      <div className="hero-section">
        <h1>Welcome to Kandara College Voting System</h1>
        <p className="hero-subtitle">Secure, transparent, and modern student government elections</p>
      </div>
      
      <div className="grid">
        <div className="card">
          <div className="card-icon">🗳️</div>
          <h3>Students</h3>
          <p>Register and vote for your preferred candidates in a secure digital environment</p>
          <div className="row">
            <Link to="/student/register" className="btn btn-primary">Register</Link>
            <Link to="/student/login" className="btn btn-secondary">Login</Link>
          </div>
        </div>
        <div className="card">
          <div className="card-icon">⚙️</div>
          <h3>Administrators</h3>
          <p>Manage the voting process, upload candidates, and monitor live results</p>
          <Link to="/admin/login" className="btn btn-primary">Admin Login</Link>
        </div>
      </div>
      
      <div className="features-section">
        <h3>System Features</h3>
        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <h4>Secure Voting</h4>
            <p>JWT authentication and one-vote-per-position validation</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <h4>Live Results</h4>
            <p>Real-time vote counting with progress visualization</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📱</span>
            <h4>Mobile Friendly</h4>
            <p>Responsive design that works on all devices</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⏰</span>
            <h4>Scheduled Voting</h4>
            <p>Automated voting periods with start and end times</p>
          </div>
        </div>
      </div>
    </div>
  );
}
