import { useState } from 'react';
import { DEMO_USERS } from '../data/initialData';

export default function AuthScreen({ onLogin }) {
  const [role,      setRole]      = useState('patient');
  const [tab,       setTab]       = useState('login');
  const [email,     setEmail]     = useState('');
  const [pass,      setPass]      = useState('');
  const [name,      setName]      = useState('');
  const [regEmail,  setRegEmail]  = useState('');
  const [regPass,   setRegPass]   = useState('');
  const [phone,     setPhone]     = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error,     setError]     = useState('');

  const doLogin = () => {
    const u = DEMO_USERS.find(u => u.email === email && u.pass === pass);
    if (!u)             { setError('Invalid email or password.'); return; }
    if (u.role !== role){ setError(`This is a "${u.role}" account. Please select the correct role.`); return; }
    setError('');
    onLogin(u);
  };

  const doRegister = () => {
    if (!name || !regEmail || !phone || !regPass) { setError('Please fill in all fields.'); return; }
    if (role === 'admin' && adminCode !== 'CLINIC2024') { setError('Invalid admin access code.'); return; }
    const newUser = { email: regEmail, pass: regPass, role, name, phone };
    DEMO_USERS.push(newUser);
    setError('');
    onLogin(newUser);
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo" style={{ textAlign: 'center', marginBottom: 24 }}>
          <div className="auth-logo-icon">⚕️</div>
          <h1>Medi<span>Queue</span></h1>
          <p>Smart Clinic Queue Management</p>
        </div>

        {/* Role Toggle */}
        <div className="role-toggle">
          <button className={`role-btn ${role === 'patient' ? 'active' : ''}`} onClick={() => { setRole('patient'); setError(''); }}>
            🧑 Patient
          </button>
          <button className={`role-btn ${role === 'admin' ? 'active' : ''}`} onClick={() => { setRole('admin'); setError(''); }}>
            🛡️ Admin / Doctor
          </button>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setError(''); }}>
            Sign In
          </button>
          <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); setError(''); }}>
            Register
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 9, padding: '9px 13px', fontSize: 12, color: '#dc2626', marginBottom: 16 }}>
            ⚠️ {error}
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={pass}
                onChange={e => setPass(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doLogin()}
              />
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={doLogin}>
              Sign In →
            </button>
            <div className="demo-hint">
              Admin: <strong>admin@clinic.com</strong> / admin &nbsp;|&nbsp;
              Patient: <strong>patient@clinic.com</strong> / patient
            </div>
          </div>
        )}

        {/* REGISTER FORM */}
        {tab === 'register' && (
          <div>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
            </div>
            {role === 'admin' && (
              <div className="form-group">
                <label className="form-label">Admin Access Code</label>
                <input className="form-input" placeholder="Enter clinic admin code" value={adminCode} onChange={e => setAdminCode(e.target.value)} />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">WhatsApp Number</label>
              <div className="phone-row">
                <div className="phone-prefix">🇮🇳 +91</div>
                <input className="form-input" type="tel" placeholder="98765 43210" maxLength={10} value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min 6 characters" value={regPass} onChange={e => setRegPass(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={doRegister}>
              Create Account →
            </button>
            <p style={{ textAlign: 'center', fontSize: 11, color: '#64748b', marginTop: 10 }}>
              Admin code for demo: <strong>CLINIC2024</strong>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}