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
  const { user, client, previewAs, loading } = usePortal();
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

  if (loading && !user) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="serif" style={{ fontSize: 26, marginBottom: 8 }}>WeGrow Client Portal</div>
          <div className="small muted">Connecting to database…</div>
        </div>
      </div>
    );
  }

  // Not logged in: route to login
  if (!user) {
    return (
      <Routes>
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
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const navigateTo = (path: string) => {
    navigate(path.startsWith('/') ? path : `/${path}`);
    window.scrollTo(0, 0);
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
