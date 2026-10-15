import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePortal } from '../../context/PortalContext';
import { Icon, WeGrowLogo, ClientLogo } from '../common/Icons';
import { fmt, fmtL, TODAY } from '../../utils/date';

interface ShellProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/action-plan', label: 'Action Plan', icon: 'plan' },
  { path: '/sessions', label: 'Sessions', icon: 'sessions' },
  { path: '/reports', label: 'Reports & Summaries', icon: 'reports' },
  { path: '/updates', label: 'Business Updates', icon: 'updates' },
  { path: '/analytics', label: 'Analytics', icon: 'analytics' },
  { path: '/calendar', label: 'Calendar', icon: 'calendar' },
  { path: '/events', label: 'Events', icon: 'events' },
  { path: '/photos', label: 'Photos', icon: 'photos' },
  { path: '/feedback', label: 'Feedback', icon: 'feedback' },
  { path: '/documents', label: 'Documents', icon: 'documents' },
  { path: '/notifications', label: 'Notifications', icon: 'bell' },
  { path: '/profile', label: 'Profile', icon: 'user' },
  { path: '/settings', label: 'Settings', icon: 'settings' }
];

const ADMIN_NAV_ITEMS = [
  { path: '/admin', label: 'Clients', icon: 'building' },
  { path: '/admin/feedback', label: 'Feedback received', icon: 'feedback' },
  { path: '/admin/publish', label: 'Publish update', icon: 'send' }
];

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    client,
    previewAs,
    setPreviewAs,
    theme,
    setTheme,
    collapsed,
    setCollapsed,
    sidebarOpen,
    setSidebarOpen,
    logout
  } = usePortal();

  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const showAdminNav = isAdmin && !previewAs;
  const navList = showAdminNav ? ADMIN_NAV_ITEMS : NAV_ITEMS;

  const unreadCount = client ? client.notifications.filter((n) => !n.read).length : 0;
  const pendingFeedbackCount = client
    ? client.sessions.filter(
        (s) => s.status === 'Completed' && !client.feedback.some((f) => f.session === s.id)
      ).length
    : 0;

  const getNavGroup = (idx: number) => {
    if (showAdminNav) return null;
    if (idx === 0) return null;
    if (idx === 2) return <div className="nav-group">Engagement</div>;
    if (idx === 6) return <div className="nav-group">Schedule &amp; media</div>;
    if (idx === 11) return <div className="nav-group">Account</div>;
    return null;
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {isAdmin && client && (
        <div className="admin-strip">
          <span>
            <Icon name="shield" /> Consultant preview — you are viewing <b>{client.company}</b> exactly as the client sees it.
          </span>
          <button
            onClick={() => {
              setPreviewAs(null);
              navigate('/admin');
            }}
          >
            Exit preview
          </button>
        </div>
      )}

      <div className={`app ${collapsed ? 'collapsed' : ''}`}>
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Main navigation">
          <div className="sb-brand">
            <WeGrowLogo size={34} />
            <div className="wordmark">
              WeGrow B School
              <small>{showAdminNav ? 'Consultant console' : 'Client Portal'}</small>
            </div>
          </div>

          <nav className="nav">
            {navList.map((item, idx) => {
              const isActive = location.pathname === item.path;
              return (
                <React.Fragment key={item.path}>
                  {getNavGroup(idx)}
                  <button
                    type="button"
                    className={`nav-btn ${isActive ? 'on' : ''}`}
                    onClick={() => handleNavClick(item.path)}
                    title={item.label}
                  >
                    <Icon name={item.icon} />
                    <span>{item.label}</span>
                    {item.path === '/notifications' && unreadCount > 0 && (
                      <span className="count">{unreadCount}</span>
                    )}
                    {item.path === '/feedback' && pendingFeedbackCount > 0 && (
                      <span className="count">{pendingFeedbackCount}</span>
                    )}
                  </button>
                </React.Fragment>
              );
            })}

            <button
              type="button"
              className="nav-btn"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Log out"
              style={{ marginTop: 'auto' }}
            >
              <Icon name="logout" />
              <span>Log out</span>
            </button>
          </nav>

          <div className="sb-foot">Business Transformation &amp; Management Consulting</div>
        </aside>

        {sidebarOpen && <div className="scrim" onClick={() => setSidebarOpen(false)} />}

        <div className="main">
          <header className="header">
            <button
              className="iconbtn mobile-only"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Icon name="menu" />
            </button>
            <button
              className="iconbtn desk-only"
              onClick={() => setCollapsed(!collapsed)}
              aria-label="Collapse sidebar"
            >
              <Icon name="collapse" />
            </button>

            <div className="cobrand">
              {client ? (
                <>
                  <ClientLogo client={client} size={34} />
                  <span className="x">×</span>
                  <WeGrowLogo size={34} />
                  <span className="cname">{client.company}</span>
                </>
              ) : (
                <>
                  <WeGrowLogo size={34} />
                  <span className="cname">Consultant console</span>
                </>
              )}
            </div>

            {client && (
              <div className="period">
                <Icon name="calendar" />
                <span>Consulting period</span>
                <b>
                  {fmt(client.start)} – {fmt(client.end)}
                </b>
              </div>
            )}

            <div className="hdr-right">
              {client && (
                <button
                  className="iconbtn"
                  onClick={() => handleNavClick('/notifications')}
                  aria-label="Notifications"
                >
                  <Icon name="bell" />
                  {unreadCount > 0 && <span className="pip" />}
                </button>
              )}

              <button
                className="userbtn"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-haspopup="true"
                aria-expanded={menuOpen}
              >
                <span
                  className="avatar"
                  style={isAdmin ? { background: 'var(--brand-soft)', color: 'var(--brand)' } : {}}
                >
                  {user?.name
                    ? user.name
                        .split(' ')
                        .map((x) => x[0])
                        .slice(0, 2)
                        .join('')
                    : 'U'}
                </span>
                <span className="who">
                  <b>{user?.name}</b>
                  <span>{isAdmin ? 'WeGrow Consultant' : client?.company}</span>
                </span>
              </button>
            </div>
          </header>

          {menuOpen && (
            <div className="dropdown" role="menu">
              {client && !isAdmin && (
                <>
                  <button
                    onClick={() => {
                      handleNavClick('/profile');
                      setMenuOpen(false);
                    }}
                  >
                    <Icon name="user" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      handleNavClick('/settings');
                      setMenuOpen(false);
                    }}
                  >
                    <Icon name="settings" />
                    Settings
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                  setMenuOpen(false);
                }}
              >
                <Icon name="moon" />
                Toggle dark mode
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
              >
                <Icon name="logout" />
                Log out
              </button>
            </div>
          )}

          <main className="content" id="page">
            {children}
          </main>

          <footer className="footer">
            <div>
              <b>WeGrow B School</b> · Business Transformation &amp; Management Consulting
            </div>
            <div>Demo data as of {fmtL(TODAY)}</div>
          </footer>
        </div>
      </div>

      {client && (
        <nav className="bottomnav" aria-label="Quick navigation">
          {[
            { path: '/dashboard', label: 'Home', icon: 'dashboard' },
            { path: '/action-plan', label: 'Plan', icon: 'plan' },
            { path: '/sessions', label: 'Sessions', icon: 'sessions' },
            { path: '/calendar', label: 'Calendar', icon: 'calendar' },
            { path: '/notifications', label: 'Alerts', icon: 'bell' }
          ].map((item) => (
            <button
              key={item.path}
              className={location.pathname === item.path ? 'on' : ''}
              onClick={() => handleNavClick(item.path)}
            >
              <Icon name={item.icon} />
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </>
  );
};
