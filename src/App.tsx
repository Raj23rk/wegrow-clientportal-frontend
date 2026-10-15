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
  AdminClientsPage,
  AdminFeedbackPage,
  AdminPublishPage
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

export const App: React.FC = () => {
  const { user, client, previewAs, loading } = usePortal();
  const navigate = useNavigate();
  const location = useLocation();

  // Modal states
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [activeUpdateId, setActiveUpdateId] = useState<string | null>(null);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);
  const [activeDocName, setActiveDocName] = useState<string | null>(null);
  const [feedbackSessionId, setFeedbackSessionId] = useState<string | null>(null);
  const [showForgotPw, setShowForgotPw] = useState<boolean>(false);

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
      <Shell>
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
          <Route path="/admin" element={<AdminClientsPage onNavigate={navigateTo} />} />
          <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
          <Route path="/admin/publish" element={<AdminPublishPage />} />

          {/* Fallback */}
          <Route
            path="*"
            element={<Navigate to={user.role === 'admin' && !previewAs ? '/admin' : '/dashboard'} replace />}
          />
        </Routes>
      </Shell>

      {/* Active Modals */}
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
    </>
  );
};
