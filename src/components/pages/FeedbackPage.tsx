import React, { useState, useEffect } from 'react';
import { usePortal } from '../../context/PortalContext';
import { fmt } from '../../utils/date';
import { api } from '../../services/api';
import { FeedbackQrModal } from '../modals/FeedbackQrModal';
import { Sparkles, QrCode, ExternalLink, Star } from 'lucide-react';

interface FeedbackPageProps {
  onGiveFeedback: (sessionId: string) => void;
}

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ onGiveFeedback }) => {
  const { client } = usePortal();
  const [eventFeedbacks, setEventFeedbacks] = useState<any[]>([]);
  const [showQrModal, setShowQrModal] = useState(false);

  const loadFeedbacks = async () => {
    try {
      const cached =
        localStorage.getItem('leadership_in_action_feedbacks') ||
        localStorage.getItem('lead360_submitted_feedbacks');
      let list: any[] = cached ? JSON.parse(cached) : [];

      try {
        const res = await api.attendance.getFeedbackForms();
        if (res && res.feedbacks && Array.isArray(res.feedbacks)) {
          const apiIds = new Set(res.feedbacks.map((x: any) => x.id || x._id));
          const extra = list.filter((l: any) => !l.id || !apiIds.has(l.id));
          list = [...res.feedbacks, ...extra];
        }
      } catch (err) {
        console.warn('API getFeedbackForms fallback to local:', err);
      }

      setEventFeedbacks(list);
    } catch (e) {
      console.error('Failed to load event feedbacks:', e);
    }
  };

  useEffect(() => {
    loadFeedbacks();

    const handleNew = () => loadFeedbacks();
    window.addEventListener('feedback_submitted', handleNew);
    window.addEventListener('storage', handleNew);

    return () => {
      window.removeEventListener('feedback_submitted', handleNew);
      window.removeEventListener('storage', handleNew);
    };
  }, []);

  if (!client) return null;

  const isSessionEvaluated = (s: any) =>
    client.feedback.some(
      (f) =>
        f.session === s.id ||
        (s.sessionId && f.session === s.sessionId) ||
        (f.session && f.session.replace('S0', 'S') === s.id) ||
        (s.sessionId && f.session.replace('S0', 'S') === s.sessionId) ||
        (s._id && f.session === s._id)
    );

  const pendingFeedbackList = client.sessions.filter(
    (s) => s.status === 'Completed' && !isSessionEvaluated(s)
  );

  const ratingMap: Record<string, number> = {
    'Excellent': 5,
    'Very good': 4,
    'Good': 3,
    'Average': 2,
    'Poor': 1
  };

  const normalizedEventFeedbacks = eventFeedbacks.map((f, idx) => ({
    id: f.id || f._id || `evt-${idx}`,
    title: f.programmeTitle || 'Leadership in Action',
    name: f.name || 'Anonymous Participant',
    designation: f.designation || 'Participant',
    department: f.department || 'Operations',
    date: f.date || (f.submittedAt ? f.submittedAt.slice(0, 10) : ''),
    rating: typeof f.rating === 'number' ? f.rating : (ratingMap[f.overallRating] || 5),
    overallRating: f.overallRating || 'Excellent',
    useful: f.mostUseful || '',
    improve: f.howCanImprove || f.leastUseful || '',
    comments: f.otherComments || '',
    isEvent: true
  }));

  const sessionFeedbacks = client.feedback.map((f, idx) => {
    const s = client.sessions.find(
      (x) =>
        x.id === f.session ||
        x.sessionId === f.session ||
        (x.sessionId && x.sessionId === f.session.replace('S0', 'S')) ||
        x._id === f.session
    );
    return {
      id: (f as any).id || `sess-${idx}`,
      title: s ? s.title : f.session,
      name: client.contact || client.company,
      designation: client.contactTitle || 'Leadership',
      department: 'Management',
      date: f.date || '',
      rating: f.rating || 5,
      overallRating: f.relevance || 'Relevant',
      useful: f.useful || '',
      improve: f.improve || '',
      comments: f.comments || '',
      isEvent: false
    };
  });

  const allSubmitted = [...normalizedEventFeedbacks, ...sessionFeedbacks].sort(
    (a, b) => (b.date || '').localeCompare(a.date || '')
  );

  return (
    <>
      <div className="pagehead">
        <div>
          <h1>Programme & session feedback</h1>
          <p>Your team's ratings and reviews shape future sessions. Only your WeGrow team sees them.</p>
        </div>
      </div>

      {/* Leadership in Action Action Card */}
      <div
        className="card"
        style={{
          marginBottom: 20,
          background: 'linear-gradient(135deg, #0C1D36 0%, #162947 100%)',
          color: '#FFFFFF',
          padding: '20px 24px',
          borderRadius: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                backgroundColor: '#E86014',
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: 4,
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}
            >
              Live Feedback Form
            </span>
            <span style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.7)' }}>
              Leadership in Action
            </span>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: '#FFFFFF' }}>
            Participant Feedback Collection
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(255, 255, 255, 0.8)' }}>
            Share the evaluation form or QR code with your middle-management participants to submit feedback.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowQrModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer'
            }}
          >
            <QrCode size={15} /> Show QR Code
          </button>
          <a
            href="/feedback-form"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              backgroundColor: '#E86014',
              color: '#FFFFFF',
              border: 'none',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            <ExternalLink size={15} /> Open Feedback Form
          </a>
        </div>
      </div>

      {pendingFeedbackList.length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-head">
            <h3>Waiting for your feedback</h3>
            <span className="badge b-teal">{pendingFeedbackList.length}</span>
          </div>
          {pendingFeedbackList.map((s) => (
            <div key={s.id} className="li">
              <div className="grow">
                <div className="ttl">{s.title}</div>
                <div className="sub">
                  {fmt(s.date)} · {s.mode}
                </div>
              </div>
              <button className="btn sm teal" onClick={() => onGiveFeedback(s.id)}>
                Give feedback
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div className="card-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Submitted feedback ({allSubmitted.length})</h3>
          <span className="badge b-teal">{allSubmitted.length} total reviews</span>
        </div>
        {allSubmitted.length > 0 ? (
          allSubmitted.map((item, idx) => (
            <div key={item.id || idx} className="li" style={{ alignItems: 'flex-start', padding: '16px 0', borderBottom: '1px solid var(--line-2, #F1F5F9)' }}>
              <div className="grow">
                <div className="row-between">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <div className="ttl" style={{ margin: 0 }}>{item.title}</div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: item.isEvent ? 'rgba(232, 96, 20, 0.12)' : 'rgba(12, 29, 54, 0.08)',
                        color: item.isEvent ? '#E86014' : '#0C1D36'
                      }}
                    >
                      {item.isEvent ? 'Leadership Programme' : 'Consulting Session'}
                    </span>
                  </div>
                  <span style={{ color: '#E0A526', whiteSpace: 'nowrap', fontSize: 16 }}>
                    {'★'.repeat(item.rating)}
                    <span style={{ color: 'var(--line-2, #CBD5E1)' }}>{'★'.repeat(Math.max(0, 5 - item.rating))}</span>
                  </span>
                </div>
                <div className="sub" style={{ marginTop: 4 }}>
                  Submitted by: <b>{item.name}</b> {item.designation ? `(${item.designation})` : ''} · {item.department} · {fmt(item.date)}
                </div>
                {item.useful && (
                  <div className="small" style={{ marginTop: 8, background: '#F8FAFC', padding: '8px 12px', borderRadius: 8 }}>
                    <b>What was useful:</b> {item.useful}
                  </div>
                )}
                {item.improve && (
                  <div className="small" style={{ marginTop: 6, background: '#FFF7ED', padding: '8px 12px', borderRadius: 8 }}>
                    <b style={{ color: '#C2410C' }}>Improvement suggestion:</b> {item.improve}
                  </div>
                )}
                {item.comments && (
                  <div className="small muted" style={{ marginTop: 4, fontStyle: 'italic' }}>
                    "{item.comments}"
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty" style={{ padding: '36px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
            <b>No feedback yet</b>
            <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
              When participants submit feedback through the form or QR code, their ratings and reviews appear here.
            </div>
          </div>
        )}
      </div>

      {showQrModal && <FeedbackQrModal onClose={() => setShowQrModal(false)} />}
    </>
  );
};
