import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortal } from '../../context/PortalContext';
import { WeGrowLogo } from '../common/Icons';

export const LoginPage: React.FC<{ onForgotPw: () => void }> = ({ onForgotPw }) => {
  const { login, loading } = usePortal();
  const navigate = useNavigate();

  // Pre-filled with Meridian Foods demo credentials for convenience
  const [email, setEmail] = useState('arjun@meridianfoods.in');
  const [password, setPassword] = useState('demo123');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Enter your email or Client ID and your password.');
      return;
    }
    setError(null);
    const ok = await login(email, password, remember);
    if (ok) {
      navigate(email === 'admin@wegrow.in' ? '/admin' : '/dashboard');
    } else {
      setError('That email or password is not recognised. Check both and try again.');
    }
  };

  const handleQuickFill = async (fillEmail: string, fillPw: string) => {
    setEmail(fillEmail);
    setPassword(fillPw);
    setError(null);
    const ok = await login(fillEmail, fillPw, true);
    if (ok) {
      navigate(fillEmail === 'admin@wegrow.in' ? '/admin' : '/dashboard');
    }
  };

  return (
    <div className="login">
      <section className="login-art">
        <svg className="bg" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <circle cx="560" cy="120" r="220" fill="#3A2470" />
          <circle cx="520" cy="700" r="260" fill="#2E1B5E" />
          <path d="M-20 620 L120 520 L220 580 L360 420 L480 470 L640 280" fill="none" stroke="#5B3AA6" strokeWidth="3" />
          <path d="M-20 660 L120 560 L220 620 L360 460 L480 510 L640 320" fill="none" stroke="#3CC3BF" strokeWidth="2" opacity="0.7" />
          <circle cx="360" cy="420" r="7" fill="#3CC3BF" />
          <circle cx="480" cy="470" r="5" fill="#fff" opacity="0.7" />
        </svg>

        <div className="brandrow">
          <WeGrowLogo size={44} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>WeGrow B School</div>
            <div style={{ fontSize: 13, color: '#B9ACE0' }}>Business Transformation &amp; Management Consulting</div>
          </div>
        </div>

        <div>
          <h1>Every decision, session and milestone of your transformation in one place.</h1>
          <p>
            Your action plan, consulting sessions, reports and progress — shared openly between your leadership team and your WeGrow consultants.
          </p>
          <div className="stats">
            <div>
              <b>6-month</b>
              <span>structured action plans</span>
            </div>
            <div>
              <b>Live</b>
              <span>progress tracking</span>
            </div>
            <div>
              <b>Private</b>
              <span>to your company only</span>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', fontSize: 12, color: '#9C8FC8' }}>
          © 2026 WeGrow B School
        </div>
      </section>

      <section className="login-form">
        <form className="box" onSubmit={handleSubmit} noValidate>
          <h2>Welcome back</h2>
          <p className="muted" style={{ margin: '0 0 26px' }}>
            Access your business transformation journey.
          </p>

          {error && (
            <div className="err" role="alert">
              {error}
            </div>
          )}

          <div className="field">
            <label htmlFor="em">Email or Client ID</label>
            <input
              className="input"
              id="em"
              autoComplete="username"
              placeholder="you@company.com or C001"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="pw">Password</label>
            <input
              className="input"
              id="pw"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="row-between" style={{ margin: '4px 0 22px' }}>
            <label className="check">
              <input
                type="checkbox"
                id="rm"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={onForgotPw}
              className="small"
              style={{ fontWeight: 600, background: 'none', border: 'none', color: 'var(--brand)', cursor: 'pointer' }}
            >
              Forgot password?
            </button>
          </div>

          <button className="btn primary block" type="submit" disabled={loading}>
            {loading ? 'Authenticating…' : 'Log in to client portal'}
          </button>

          <div className="demo-accts">
            <div className="small muted" style={{ fontWeight: 600 }}>Quick login accounts</div>
            <button
              type="button"
              className="chipbtn"
              onClick={() => handleQuickFill('arjun@meridianfoods.in', 'demo123')}
            >
              <span>
                <b className="small">Meridian Foods</b>
                <br />
                <span className="tiny muted">Client Account · arjun@meridianfoods.in</span>
              </span>
            </button>

            <button
              type="button"
              className="chipbtn"
              onClick={() => handleQuickFill('lakshmi@kaveritextiles.in', 'demo123')}
            >
              <span>
                <b className="small">Kaveri Textiles</b>
                <br />
                <span className="tiny muted">Client Account · lakshmi@kaveritextiles.in</span>
              </span>
            </button>

            <button
              type="button"
              className="chipbtn"
              onClick={() => handleQuickFill('admin@wegrow.in', 'admin123')}
            >
              <span>
                <b className="small">WeGrow Consultant</b>
                <br />
                <span className="tiny muted">Admin / Consultant Account · admin@wegrow.in</span>
              </span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
