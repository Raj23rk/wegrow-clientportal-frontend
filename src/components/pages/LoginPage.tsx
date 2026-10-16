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
        {/* Animated dynamic SVG background */}
        <svg className="bg" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            {/* Vibrant Line Gradients */}
            <linearGradient id="purpleLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6E44C4" />
              <stop offset="50%" stopColor="#A875FF" />
              <stop offset="100%" stopColor="#7E4CE8" />
            </linearGradient>
            <linearGradient id="tealLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#25A5A1" />
              <stop offset="50%" stopColor="#48F1EB" />
              <stop offset="100%" stopColor="#3CC3BF" />
            </linearGradient>

            {/* Glowing Flow Dash Gradients */}
            <linearGradient id="tealPulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3CC3BF" stopOpacity="0" />
              <stop offset="60%" stopColor="#48F1EB" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="purplePulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7E4CE8" stopOpacity="0" />
              <stop offset="60%" stopColor="#C49BFF" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>

            {/* Soft Ambient Background Orbs */}
            <radialGradient id="orbGrad1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6A3FB8" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#3A2470" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#241448" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="orbGrad2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4B2488" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#2E1B5E" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#241448" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="orbGradTeal" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3CC3BF" stopOpacity="0.32" />
              <stop offset="50%" stopColor="#268A87" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#241448" stopOpacity="0" />
            </radialGradient>

            {/* Area Fills under lines */}
            <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8A56EB" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#241448" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="tealAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3CC3BF" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#241448" stopOpacity="0" />
            </linearGradient>

            {/* Glow Filters */}
            <filter id="glowTeal" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glowPurple" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Animated Floating Orbs */}
          <circle cx="560" cy="130" r="230" fill="url(#orbGrad1)" className="bg-orb orb-1" />
          <circle cx="520" cy="690" r="270" fill="url(#orbGrad2)" className="bg-orb orb-2" />
          <circle cx="280" cy="450" r="190" fill="url(#orbGradTeal)" className="bg-orb orb-3" />

          {/* Twinkling ambient grid stars */}
          <g className="bg-particles">
            <circle cx="120" cy="180" r="1.8" fill="#A88BFF" className="twinkle-dot" />
            <circle cx="380" cy="140" r="2.2" fill="#3CC3BF" className="twinkle-dot" />
            <circle cx="220" cy="320" r="1.5" fill="#ffffff" className="twinkle-dot" />
            <circle cx="490" cy="310" r="2" fill="#D2BDFF" className="twinkle-dot" />
            <circle cx="80" cy="440" r="1.8" fill="#3CC3BF" className="twinkle-dot" />
            <circle cx="530" cy="520" r="2" fill="#ffffff" className="twinkle-dot" />
            <circle cx="160" cy="680" r="1.5" fill="#3CC3BF" className="twinkle-dot" />
            <circle cx="420" cy="650" r="2.2" fill="#A88BFF" className="twinkle-dot" />
          </g>

          {/* Animated Line & Area Group */}
          <g className="chart-lines-group">
            {/* Area Fills under lines */}
            <path
              d="M-20 620 L120 520 L220 580 L360 420 L480 470 L640 280 L640 820 L-20 820 Z"
              fill="url(#purpleAreaGrad)"
            />
            <path
              d="M-20 660 L120 560 L220 620 L360 460 L480 510 L640 320 L640 820 L-20 820 Z"
              fill="url(#tealAreaGrad)"
            />

            {/* Base Continuous Trend Lines */}
            <path
              d="M-20 620 L120 520 L220 580 L360 420 L480 470 L640 280"
              fill="none"
              stroke="url(#purpleLineGrad)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M-20 660 L120 560 L220 620 L360 460 L480 510 L640 320"
              fill="none"
              stroke="url(#tealLineGrad)"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />

            {/* Dynamic Flowing Laser/Dash Trails */}
            <path
              d="M-20 620 L120 520 L220 580 L360 420 L480 470 L640 280"
              fill="none"
              stroke="url(#purplePulseGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glowPurple)"
              className="flowing-dash-purple"
            />
            <path
              d="M-20 660 L120 560 L220 620 L360 460 L480 510 L640 320"
              fill="none"
              stroke="url(#tealPulseGrad)"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glowTeal)"
              className="flowing-dash-teal"
            />

            {/* Traveling Light Energy Comets */}
            <circle r="4.5" fill="#ffffff" filter="url(#glowPurple)">
              <animateMotion
                path="M-20 620 L120 520 L220 580 L360 420 L480 470 L640 280"
                dur="8s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="4" fill="#69FFF8" filter="url(#glowTeal)">
              <animateMotion
                path="M-20 660 L120 560 L220 620 L360 460 L480 510 L640 320"
                dur="6.5s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Glowing Milestone Data Nodes */}
            <circle cx="360" cy="420" r="7" className="pulse-ripple ripple-1" stroke="#3CC3BF" fill="none" />
            <circle cx="360" cy="420" r="7" className="pulse-ripple ripple-2" stroke="#3CC3BF" fill="none" />
            <circle cx="360" cy="420" r="7.5" fill="#3CC3BF" filter="url(#glowTeal)" />
            <circle cx="360" cy="420" r="3" fill="#ffffff" />

            <circle cx="480" cy="470" r="5" className="pulse-ripple ripple-1" stroke="#ffffff" fill="none" />
            <circle cx="480" cy="470" r="5.5" fill="#ffffff" filter="url(#glowPurple)" />
            <circle cx="480" cy="470" r="2.2" fill="#3A1F73" />

            <circle cx="220" cy="620" r="4.5" fill="#3CC3BF" filter="url(#glowTeal)" />
            <circle cx="220" cy="620" r="2" fill="#ffffff" />

            <circle cx="480" cy="510" r="4.5" fill="#3CC3BF" opacity="0.9" />
          </g>
        </svg>

        <div className="brandrow">
          <div className="hero-logo-badge">
            <img src="/wegrow-logo.webp" alt="WeGrow B School" className="hero-logo-img" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-0.01em' }}>WeGrow B School</div>
            <div style={{ fontSize: 13, color: '#C4B7EC' }}>Business Transformation &amp; Management Consulting</div>
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
          <div className="login-form-brand">
            <img src="/wegrow-logo.webp" alt="WeGrow B School" />
          </div>
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
