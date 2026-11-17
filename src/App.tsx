import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { usePortal } from './context/PortalContext';
import { Shell } from './components/layout/Shell';
import { LoginPage } from './components/pages/LoginPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { ActionPlanPage } from './components/pages/ActionPlanPage';
import { SessionsPage } from './components/pages/SessionsPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { UpdatesPage } from './components/pages/UpdatesPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { CalendarPage } from './components/pages/CalendarPage';
import { EventsPage } from './components/pages/EventsPage';
import { PhotosPage } from './components/pages/PhotosPage';
import { FeedbackPage } from './components/pages/FeedbackPage';
import { DocumentsPage } from './components/pages/DocumentsPage';
import { NotificationsPage } from './components/pages/NotificationsPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { SettingsPage } from './components/pages/SettingsPage';
import {
  AdminOverviewPage,
  AdminClientsPage,
  AdminClientWorkspacePage,
  AdminTasksPage,
  AdminSessionsPage,
  AdminFeedbackPage,
  AdminBroadcastPage
} from './components/pages/AdminPages';
import { AdminAttendancePage } from './components/pages/AdminAttendancePage';
import { EventLandingPage } from './components/pages/EventLandingPage';
import { Lead360ViewerPage } from './components/pages/Lead360ViewerPage';
import { Lead360FeedbackPage } from './components/pages/Lead360FeedbackPage';
import {
  SessionModal,
  ActionModal,
  ReportModal,
  UpdateModal,
  EventModal,
  PhotoModal,
  DocumentModal,
  FeedbackModal,
  ForgotPasswordModal
} from './components/modals/DetailModals';
import {
  AddClientModal,
  AssignTaskModal,
  ScheduleSessionModal,
  UploadModal,
  BroadcastModal,
  SessionSummaryModal,
  ScoresModal,
  EditMonthModal
} from './components/modals/AdminModals';

const PortalLoadingScreen: React.FC<{ user: any }> = ({ user }) => {
  const [statusText, setStatusText] = useState(
    user ? 'Loading your transformation dossier' : 'Connecting to database'
  );

  useEffect(() => {
    const list = user
      ? [
          'Loading your transformation dossier',
          'Fetching client milestones & sessions',
          'Synchronizing attendance & analytics',
          'Almost ready'
        ]
      : [
          'Connecting to database',
          'Establishing secure connection',
          'Synchronizing portal services',
          'Preparing workspace'
        ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % list.length;
      setStatusText(list[idx]);
    }, 2000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 30%, rgba(232, 96, 20, 0.08), transparent 60%), var(--bg, #F8F9FA)',
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes wgSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes wgSpinReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes wgPulseGlow {
          0%, 100% {
            transform: scale(0.92);
            box-shadow: 0 0 14px rgba(232, 96, 20, 0.35);
          }
          50% {
            transform: scale(1.08);
            box-shadow: 0 0 26px rgba(232, 96, 20, 0.7);
          }
        }
        @keyframes wgCardFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes wgBarFlow {
          0% {
            left: -35%;
            width: 35%;
          }
          50% {
            width: 55%;
          }
          100% {
            left: 100%;
            width: 35%;
          }
        }
        @keyframes wgGlowSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
        @keyframes wgDotWave {
          0%, 20% { opacity: 0.2; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-3px); }
          80%, 100% { opacity: 0.2; transform: translateY(0); }
        }
        @keyframes wgOrbDrift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.35; }
          50% { transform: translate(25px, -20px) scale(1.15); opacity: 0.55; }
        }
        @keyframes wgFadeInScale {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* Ambient glowing background orbs */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '25%',
          left: '30%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232, 96, 20, 0.18) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'wgOrbDrift 7s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '25%',
          right: '30%',
          width: 340,
          height: 340,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(12, 29, 54, 0.12) 0%, transparent 70%)',
          filter: 'blur(55px)',
          animation: 'wgOrbDrift 8s ease-in-out infinite reverse',
          pointerEvents: 'none',
        }}
      />

      {/* Main Loading Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          background: 'var(--surface, #ffffff)',
          border: '1.5px solid rgba(12, 29, 54, 0.08)',
          borderRadius: 24,
          padding: '40px 48px',
          boxShadow: '0 20px 50px rgba(12, 29, 54, 0.1), 0 1px 3px rgba(0, 0, 0, 0.04)',
          maxWidth: 430,
          width: '100%',
          animation: 'wgFadeInScale 0.4s ease-out, wgCardFloat 4s ease-in-out 0.4s infinite',
        }}
      >
        {/* Animated Double-Ring Orbital Spinner */}
        <div
          style={{
            position: 'relative',
            width: 68,
            height: 68,
            margin: '0 auto 20px',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {/* Outer glowing orbit track */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '3px solid rgba(232, 96, 20, 0.14)',
            }}
          />
          {/* Outer spinning gradient arc with glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor: '#E86014',
              borderRightColor: '#E86014',
              animation: 'wgSpin 1s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite',
              filter: 'drop-shadow(0 0 6px rgba(232, 96, 20, 0.55))',
            }}
          />
          {/* Inner counter-spinning secondary arc */}
          <div
            style={{
              position: 'absolute',
              inset: 7,
              borderRadius: '50%',
              border: '2px solid transparent',
              borderBottomColor: '#3CC3BF',
              borderLeftColor: '#3CC3BF',
              animation: 'wgSpinReverse 1.5s linear infinite',
            }}
          />
          {/* Center Pulsing Luminous Core */}
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #FF8A3D 0%, #E86014 50%, #0C1D36 100%)',
              animation: 'wgPulseGlow 1.8s ease-in-out infinite',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {/* Center sparkle star */}
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="#FFFFFF"
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
              }}
            >
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div
          className="serif"
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: 'var(--ink, #0C1D36)',
            marginBottom: 6,
            letterSpacing: '-0.3px',
          }}
        >
          WeGrow Client Portal
        </div>

        {/* Status Text with Animated Bouncing Wave Dots */}
        <div
          className="small muted"
          style={{
            marginBottom: 22,
            fontSize: 13.5,
            color: 'var(--ink-2, #64748B)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 22,
          }}
        >
          <span>{statusText}</span>
          <span style={{ display: 'inline-flex', gap: 2, marginLeft: 2, color: '#E86014' }}>
            <span style={{ animation: 'wgDotWave 1.3s infinite', animationDelay: '0s', fontWeight: 800 }}>.</span>
            <span style={{ animation: 'wgDotWave 1.3s infinite', animationDelay: '0.22s', fontWeight: 800 }}>.</span>
            <span style={{ animation: 'wgDotWave 1.3s infinite', animationDelay: '0.44s', fontWeight: 800 }}>.</span>
          </span>
        </div>

        {/* Dynamic Glowing Flow Progress Bar */}
        <div
          style={{
            height: 6,
            borderRadius: 999,
            background: 'rgba(12, 29, 54, 0.08)',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* Subtle base track fill */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '100%',
              background: 'linear-gradient(90deg, #0C1D36 0%, #E86014 50%, #3CC3BF 100%)',
              opacity: 0.12,
            }}
          />
          {/* Active sweeping luminous progress beam */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              borderRadius: 999,
              background: 'linear-gradient(90deg, transparent 0%, #0C1D36 25%, #E86014 65%, #FF8A3D 90%, #FFFFFF 100%)',
              boxShadow: '0 0 12px rgba(232, 96, 20, 0.65)',
              animation: 'wgBarFlow 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            }}
          />
          {/* High-speed light flare reflection */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: 50,
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.75), transparent)',
              animation: 'wgGlowSweep 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const { user, client, previewAs, loading, safeNavigate } = usePortal();
  const navigate = useNavigate();
  const location = useLocation();

  // Client Detail Modal states
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [activeUpdateId, setActiveUpdateId] = useState<string | null>(null);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);
  const [activeDocName, setActiveDocName] = useState<string | null>(null);
  const [feedbackSessionId, setFeedbackSessionId] = useState<string | null>(null);
  const [showForgotPw, setShowForgotPw] = useState<boolean>(false);

  // Admin Modal states
  const [showAddClient, setShowAddClient] = useState<boolean>(false);
  const [assignTaskState, setAssignTaskState] = useState<{
    open: boolean;
    clientId?: string;
    month?: number;
    action?: any;
  } | null>(null);
  const [scheduleSessionState, setScheduleSessionState] = useState<{
    open: boolean;
    clientId?: string;
    session?: any;
  } | null>(null);
  const [uploadState, setUploadState] = useState<{
    open: boolean;
    clientId?: string;
  } | null>(null);
  const [showBroadcast, setShowBroadcast] = useState<boolean>(false);
  const [sessionSummaryState, setSessionSummaryState] = useState<{
    clientId: string;
    sessionId: string;
  } | null>(null);
  const [scoresClientId, setScoresClientId] = useState<string | null>(null);
  const [editMonthState, setEditMonthState] = useState<{
    clientId: string;
    monthNum: number;
  } | null>(null);

  // Smooth backward compatibility: automatically redirect legacy hash URLs (/#/feedback -> /feedback)
  useEffect(() => {
    if (window.location.hash.startsWith('#/')) {
      const path = window.location.hash.replace(/^#\/?/, '/');
      window.location.hash = '';
      navigate(path, { replace: true });
    }
  }, [navigate]);

  // Direct Public Workbook Viewer routes (zero delay, direct display upon QR scan)
  if (['/lead-360', '/lead360', '/workbook', '/anaamalais-toyota'].includes(location.pathname)) {
    return <Lead360ViewerPage />;
  }

  // Direct Public Participant Feedback Form routes (zero delay, mobile scan & fill)
  if (['/feedback-form', '/feedback/form', '/lead360-feedback'].includes(location.pathname)) {
    return <Lead360FeedbackPage />;
  }

  if (loading && (!user || (user.role === 'client' && !client))) {
    return <PortalLoadingScreen user={user} />;
  }

  // Public Event Landing Page routes (accessible whether logged in or out)
  if (['/meetup', '/orientation', '/landing'].includes(location.pathname)) {
    return <EventLandingPage />;
  }

  // Not logged in: root defaults to EventLandingPage, or /login for portal, or /admin/attendance
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<EventLandingPage />} />
        <Route path="/meetup" element={<EventLandingPage />} />
        <Route path="/orientation" element={<EventLandingPage />} />
        <Route path="/landing" element={<EventLandingPage />} />
        <Route path="/feedback-form" element={<Lead360FeedbackPage />} />
        <Route path="/lead360-feedback" element={<Lead360FeedbackPage />} />
        <Route path="/feedback/form" element={<Lead360FeedbackPage />} />
        <Route
          path="/admin/attendance"
          element={
            <Shell>
              <AdminAttendancePage />
            </Shell>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <LoginPage onForgotPw={() => setShowForgotPw(true)} />
              {showForgotPw && (
                <ForgotPasswordModal onClose={() => setShowForgotPw(false)} />
              )}
            </>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  const navigateTo = (path: string, label?: string) => {
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    if (location.pathname === fullPath) return;
    safeNavigate(fullPath, label);
  };

  return (
    <>
      <Shell
        onOpenAddClient={() => setShowAddClient(true)}
        onOpenAssignTask={(cid, m, a) =>
          setAssignTaskState({ open: true, clientId: cid, month: m, action: a })
        }
        onOpenScheduleSession={(cid, s) =>
          setScheduleSessionState({ open: true, clientId: cid, session: s })
        }
        onOpenUpload={(cid) => setUploadState({ open: true, clientId: cid })}
        onOpenBroadcast={() => setShowBroadcast(true)}
      >
        <Routes>
          {/* Default redirect */}
          <Route
            path="/"
            element={<Navigate to={user.role === 'admin' && !previewAs ? '/admin' : '/dashboard'} replace />}
          />
          <Route
            path="/login"
            element={<Navigate to={user.role === 'admin' && !previewAs ? '/admin' : '/dashboard'} replace />}
          />

          {/* Client Portal routes */}
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                onNavigate={navigateTo}
                onOpenAction={(id) => setActiveActionId(id)}
                onOpenSession={(id) => setActiveSessionId(id)}
                onOpenUpdate={(id) => setActiveUpdateId(id)}
                onOpenEvent={(id) => setActiveEventId(id)}
                onOpenPhoto={(id) => setActivePhotoId(id)}
                onGiveFeedback={(id) => setFeedbackSessionId(id)}
              />
            }
          />
          <Route
            path="/action-plan"
            element={<Navigate to="/dashboard" replace />}
          />
          <Route
            path="/sessions"
            element={
              <SessionsPage
                onOpenSession={(id) => setActiveSessionId(id)}
                onGiveFeedback={(id) => setFeedbackSessionId(id)}
              />
            }
          />
          <Route
            path="/attendance"
            element={<AdminAttendancePage isClientView={true} />}
          />
          <Route
            path="/reports"
            element={<ReportsPage onOpenReport={(id) => setActiveReportId(id)} />}
          />
          <Route
            path="/updates"
            element={<UpdatesPage onOpenUpdate={(id) => setActiveUpdateId(id)} />}
          />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route
            path="/calendar"
            element={
              <CalendarPage
                onOpenSession={(id) => setActiveSessionId(id)}
                onOpenAction={(id) => setActiveActionId(id)}
                onOpenEvent={(id) => setActiveEventId(id)}
              />
            }
          />
          <Route
            path="/events"
            element={<EventsPage onOpenEvent={(id) => setActiveEventId(id)} />}
          />
          <Route
            path="/photos"
            element={<PhotosPage onOpenPhoto={(id) => setActivePhotoId(id)} />}
          />
          <Route
            path="/feedback"
            element={<FeedbackPage onGiveFeedback={(id) => setFeedbackSessionId(id)} />}
          />
          <Route
            path="/documents"
            element={<DocumentsPage onViewDoc={(name) => setActiveDocName(name)} />}
          />
          <Route
            path="/notifications"
            element={<NotificationsPage onNavigate={navigateTo} />}
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminOverviewPage
                onNavigate={navigateTo}
                onOpenAddClient={() => setShowAddClient(true)}
                onOpenAssignTask={(cid, m, a) =>
                  setAssignTaskState({ open: true, clientId: cid, month: m, action: a })
                }
                onOpenScheduleSession={(cid, s) =>
                  setScheduleSessionState({ open: true, clientId: cid, session: s })
                }
                onOpenUpload={(cid) => setUploadState({ open: true, clientId: cid })}
                onOpenBroadcast={() => setShowBroadcast(true)}
                onOpenSessionSummary={(cid, sid) =>
                  setSessionSummaryState({ clientId: cid, sessionId: sid })
                }
              />
            }
          />
          <Route
            path="/admin/clients"
            element={
              <AdminClientsPage
                onNavigate={navigateTo}
                onOpenAddClient={() => setShowAddClient(true)}
              />
            }
          />
          <Route
            path="/admin/client/:id"
            element={
              <AdminClientWorkspacePage
                onOpenAssignTask={(cid, m, a) =>
                  setAssignTaskState({ open: true, clientId: cid, month: m, action: a })
                }
                onOpenScheduleSession={(cid, s) =>
                  setScheduleSessionState({ open: true, clientId: cid, session: s })
                }
                onOpenUpload={(cid) => setUploadState({ open: true, clientId: cid })}
                onOpenScores={(cid) => setScoresClientId(cid)}
                onOpenMonth={(cid, m) => setEditMonthState({ clientId: cid, monthNum: m })}
                onOpenSessionSummary={(cid, sid) =>
                  setSessionSummaryState({ clientId: cid, sessionId: sid })
                }
              />
            }
          />
          <Route
            path="/admin/client/:id/:tab"
            element={
              <AdminClientWorkspacePage
                onOpenAssignTask={(cid, m, a) =>
                  setAssignTaskState({ open: true, clientId: cid, month: m, action: a })
                }
                onOpenScheduleSession={(cid, s) =>
                  setScheduleSessionState({ open: true, clientId: cid, session: s })
                }
                onOpenUpload={(cid) => setUploadState({ open: true, clientId: cid })}
                onOpenScores={(cid) => setScoresClientId(cid)}
                onOpenMonth={(cid, m) => setEditMonthState({ clientId: cid, monthNum: m })}
                onOpenSessionSummary={(cid, sid) =>
                  setSessionSummaryState({ clientId: cid, sessionId: sid })
                }
              />
            }
          />
          <Route
            path="/admin/tasks"
            element={
              <AdminTasksPage
                onOpenAssignTask={(cid, m, a) =>
                  setAssignTaskState({ open: true, clientId: cid, month: m, action: a })
                }
              />
            }
          />
          <Route
            path="/admin/sessions"
            element={
              <AdminSessionsPage
                onOpenScheduleSession={(cid, s) =>
                  setScheduleSessionState({ open: true, clientId: cid, session: s })
                }
                onOpenSessionSummary={(cid, sid) =>
                  setSessionSummaryState({ clientId: cid, sessionId: sid })
                }
              />
            }
          />
          <Route path="/admin/attendance" element={<AdminAttendancePage />} />
          <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
          <Route
            path="/admin/broadcast"
            element={
              <AdminBroadcastPage onOpenBroadcast={() => setShowBroadcast(true)} />
            }
          />
          <Route
            path="/admin/publish"
            element={
              <AdminBroadcastPage onOpenBroadcast={() => setShowBroadcast(true)} />
            }
          />

          {/* Fallback */}
          <Route
            path="*"
            element={<Navigate to={user.role === 'admin' && !previewAs ? '/admin' : '/dashboard'} replace />}
          />
        </Routes>
      </Shell>

      {/* Client Active Modals */}
      {activeSessionId && (
        <SessionModal
          sessionId={activeSessionId}
          onClose={() => setActiveSessionId(null)}
          onGiveFeedback={(id) => setFeedbackSessionId(id)}
        />
      )}

      {activeActionId && (
        <ActionModal
          actionId={activeActionId}
          onClose={() => setActiveActionId(null)}
        />
      )}

      {activeReportId && (
        <ReportModal
          reportId={activeReportId}
          onClose={() => setActiveReportId(null)}
        />
      )}

      {activeUpdateId && (
        <UpdateModal
          updateId={activeUpdateId}
          onClose={() => setActiveUpdateId(null)}
          onNavigate={navigateTo}
        />
      )}

      {activeEventId && (
        <EventModal
          eventId={activeEventId}
          onClose={() => setActiveEventId(null)}
        />
      )}

      {activePhotoId && (
        <PhotoModal
          photoId={activePhotoId}
          onClose={() => setActivePhotoId(null)}
        />
      )}

      {activeDocName && (
        <DocumentModal
          docName={activeDocName}
          onClose={() => setActiveDocName(null)}
        />
      )}

      {feedbackSessionId && (
        <FeedbackModal
          sessionId={feedbackSessionId}
          onClose={() => setFeedbackSessionId(null)}
        />
      )}

      {/* Admin Active Modals */}
      {showAddClient && (
        <AddClientModal
          onClose={() => setShowAddClient(false)}
          onSuccess={(cid) => {
            setShowAddClient(false);
            navigateTo(`/admin/client/${cid}`);
          }}
        />
      )}

      {assignTaskState?.open && (
        <AssignTaskModal
          initialClientId={assignTaskState.clientId}
          initialMonth={assignTaskState.month}
          initialAction={assignTaskState.action}
          onClose={() => setAssignTaskState(null)}
        />
      )}

      {scheduleSessionState?.open && (
        <ScheduleSessionModal
          initialClientId={scheduleSessionState.clientId}
          initialSession={scheduleSessionState.session}
          onClose={() => setScheduleSessionState(null)}
        />
      )}

      {uploadState?.open && (
        <UploadModal
          initialClientId={uploadState.clientId}
          onClose={() => setUploadState(null)}
        />
      )}

      {showBroadcast && (
        <BroadcastModal onClose={() => setShowBroadcast(false)} />
      )}

      {sessionSummaryState && (
        <SessionSummaryModal
          clientId={sessionSummaryState.clientId}
          sessionId={sessionSummaryState.sessionId}
          onClose={() => setSessionSummaryState(null)}
        />
      )}

      {scoresClientId && (
        <ScoresModal
          clientId={scoresClientId}
          onClose={() => setScoresClientId(null)}
        />
      )}

      {editMonthState && (
        <EditMonthModal
          clientId={editMonthState.clientId}
          monthNum={editMonthState.monthNum}
          onClose={() => setEditMonthState(null)}
        />
      )}
    </>
  );
};
