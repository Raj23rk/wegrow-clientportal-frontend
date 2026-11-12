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

  if (loading && (!user || (user.role === 'client' && !client))) {
    return (
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          minHeight: '100vh',
          background: 'radial-gradient(circle at top, rgba(232, 96, 20, 0.08), transparent 55%), var(--bg)',
          padding: 24,
        }}
      >
        <style>{`
          @keyframes wgSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes wgPulse {
            0%, 100% { opacity: 0.55; transform: scale(0.96); }
            50% { opacity: 1; transform: scale(1.04); }
          }
          @keyframes wgShimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(220%); }
          }
        `}</style>
        <div
          style={{
            textAlign: 'center',
            background: 'var(--surface, #ffffff)',
            border: '1px solid var(--border, rgba(12, 29, 54, 0.1))',
            borderRadius: 20,
            padding: '36px 44px',
            boxShadow: '0 18px 45px rgba(12, 29, 54, 0.08)',
            maxWidth: 420,
            width: '100%',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: 56,
              height: 56,
              margin: '0 auto 18px',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '3px solid rgba(232, 96, 20, 0.18)',
                borderTopColor: '#E86014',
                animation: 'wgSpin 0.9s linear infinite',
              }}
            />
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0C1D36, #E86014)',
                animation: 'wgPulse 1.4s ease-in-out infinite',
              }}
            />
          </div>
          <div className="serif" style={{ fontSize: 25, fontWeight: 700, marginBottom: 6 }}>
            WeGrow Client Portal
          </div>
          <div className="small muted" style={{ marginBottom: 18 }}>
            {user ? 'Loading your transformation dossier…' : 'Connecting to database…'}
          </div>
          <div
            style={{
              height: 5,
              borderRadius: 999,
              background: 'rgba(12, 29, 54, 0.08)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '45%',
                height: '100%',
                borderRadius: 999,
                background: 'linear-gradient(90deg, #0C1D36, #E86014)',
                animation: 'wgShimmer 1.3s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>
    );
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
            element={
              <ActionPlanPage
                onOpenAction={(id) => setActiveActionId(id)}
                onNavigate={navigateTo}
              />
            }
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
