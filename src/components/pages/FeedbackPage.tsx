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
  const [expandedFeedbackId, setExpandedFeedbackId] = useState<string | null>(null);

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
    futureTopics: f.futureTopics || '',
    comments: f.otherComments || '',
    programmeContent: f.programmeContent || {},
    trainerFacilitator: f.trainerFacilitator || {},
    activities: f.activities || {},
    learningApplication: f.learningApplication || {},
    arrangementsLogistics: f.arrangementsLogistics || {},
    duration: f.programmeDuration || 'Right',
    recommend: f.recommend || 'Yes',
    raw: f,
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
                  <div className="small" style={{ marginTop: 8, background: 'var(--surface-2, #F8FAFC)', color: 'var(--ink, #0F172A)', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--line-2, #E2E8F0)' }}>
                    <b style={{ color: 'var(--brand, #0C1D36)' }}>What was useful: </b> {item.useful}
                  </div>
                )}
                {item.improve && (
                  <div className="small" style={{ marginTop: 6, background: 'var(--surface-2, #FFF7ED)', color: 'var(--ink, #0F172A)', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(234, 88, 12, 0.2)' }}>
                    <b style={{ color: '#C2410C' }}>Improvement suggestion: </b> {item.improve}
                  </div>
                )}
                {item.comments && (
                  <div className="small muted" style={{ marginTop: 4, fontStyle: 'italic', paddingLeft: 4 }}>
                    "{item.comments}"
                  </div>
                )}

                {item.isEvent && (() => {
                  const evItem = item as any;
                  return (
                    <div style={{ marginTop: 10 }}>
                      <button
                        type="button"
                        className="btn sm ghost"
                        style={{ fontSize: 12, padding: '4px 10px' }}
                        onClick={() => setExpandedFeedbackId(expandedFeedbackId === item.id ? null : item.id)}
                      >
                        {expandedFeedbackId === item.id ? '▴ Hide Detailed Answers' : '▾ View All 10 Answers / Full Evaluation'}
                      </button>

                      {expandedFeedbackId === item.id && (
                        <div
                          style={{
                            marginTop: 12,
                            background: 'var(--surface-2, #F8FAFC)',
                            border: '1px solid var(--line-2, #E2E8F0)',
                            borderRadius: 12,
                            padding: 16
                          }}
                        >
                          <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 12, color: 'var(--ink, #0F172A)' }}>
                            Detailed Evaluation Responses ({item.name})
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, fontSize: 12 }}>
                            {/* 1. Programme Content */}
                            <div style={{ background: 'var(--surface, #FFFFFF)', padding: 10, borderRadius: 8, border: '1px solid var(--line, #E2E8F0)' }}>
                              <b style={{ color: '#C2410C' }}>1. Programme Content:</b>
                              <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <div>Objectives Explained: <b>{evItem.programmeContent?.q1 || 'Agree'}</b></div>
                                <div>Objectives Met: <b>{evItem.programmeContent?.q2 || 'Agree'}</b></div>
                                <div>Relevant to Role: <b>{evItem.programmeContent?.q3 || 'Strongly agree'}</b></div>
                                <div>Topics Organised: <b>{evItem.programmeContent?.q4 || 'Agree'}</b></div>
                                <div>Appropriate Level: <b>{evItem.programmeContent?.q5 || 'Agree'}</b></div>
                              </div>
                            </div>

                            {/* 2. Trainer Facilitation */}
                            <div style={{ background: 'var(--surface, #FFFFFF)', padding: 10, borderRadius: 8, border: '1px solid var(--line, #E2E8F0)' }}>
                              <b style={{ color: '#C2410C' }}>2. Trainer & Facilitator:</b>
                              <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <div>Subject Knowledge: <b>{evItem.trainerFacilitator?.q1 || 'Excellent'}</b></div>
                                <div>Concept Clarity: <b>{evItem.trainerFacilitator?.q2 || 'Excellent'}</b></div>
                                <div>Encouraged Discussion: <b>{evItem.trainerFacilitator?.q3 || 'Very good'}</b></div>
                                <div>Answered Questions: <b>{evItem.trainerFacilitator?.q4 || 'Excellent'}</b></div>
                                <div>Time Management: <b>{evItem.trainerFacilitator?.q5 || 'Good'}</b></div>
                              </div>
                            </div>

                            {/* 3. Activities */}
                            <div style={{ background: 'var(--surface, #FFFFFF)', padding: 10, borderRadius: 8, border: '1px solid var(--line, #E2E8F0)' }}>
                              <b style={{ color: '#C2410C' }}>3. Key Workshop Activities:</b>
                              <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <div>Self-Awareness: <b>{evItem.activities?.selfAwareness || 'Excellent'}</b></div>
                                <div>Leadership Style: <b>{evItem.activities?.leadershipStyle || 'Very good'}</b></div>
                                <div>Situational Leadership: <b>{evItem.activities?.situationalLeadership || 'Good'}</b></div>
                                <div>Workplace Challenge: <b>{evItem.activities?.workplaceChallenge || 'Very good'}</b></div>
                              </div>
                            </div>

                            {/* 4. Learning & Application */}
                            <div style={{ background: 'var(--surface, #FFFFFF)', padding: 10, borderRadius: 8, border: '1px solid var(--line, #E2E8F0)' }}>
                              <b style={{ color: '#C2410C' }}>4. Learning & Confidence:</b>
                              <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <div>Gained Skills: <b>{evItem.learningApplication?.q1 || 'Strongly agree'}</b></div>
                                <div>Daily Application: <b>{evItem.learningApplication?.q2 || 'Agree'}</b></div>
                                <div>Leadership Confidence: <b>{evItem.learningApplication?.q3 || 'Strongly agree'}</b></div>
                                <div>Action Plan Clear: <b>{evItem.learningApplication?.q4 || 'Agree'}</b></div>
                              </div>
                            </div>

                            {/* 5. Arrangements & Logistics */}
                            <div style={{ background: 'var(--surface, #FFFFFF)', padding: 10, borderRadius: 8, border: '1px solid var(--line, #E2E8F0)' }}>
                              <b style={{ color: '#C2410C' }}>5. Arrangements & Venue:</b>
                              <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <div>Venue & Seating: <b>{evItem.arrangementsLogistics?.venueSeating || 'Excellent'}</b></div>
                                <div>Audio-Visual: <b>{evItem.arrangementsLogistics?.audioVisual || 'Very good'}</b></div>
                                <div>Food & Refreshments: <b>{evItem.arrangementsLogistics?.foodRefreshments || 'Good'}</b></div>
                                <div>Schedule & Breaks: <b>{evItem.arrangementsLogistics?.scheduleBreaks || 'Good'}</b></div>
                              </div>
                            </div>

                            {/* 6. Overall & Recommendations */}
                            <div style={{ background: 'var(--surface, #FFFFFF)', padding: 10, borderRadius: 8, border: '1px solid var(--line, #E2E8F0)' }}>
                              <b style={{ color: '#C2410C' }}>6. Overall Verdict:</b>
                              <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <div>Programme Rating: <b>{evItem.overallRating} ({evItem.rating}★)</b></div>
                                <div>Duration: <b>{evItem.duration}</b></div>
                                <div>Would Recommend: <b>{evItem.recommend}</b></div>
                                {evItem.futureTopics && (
                                  <div style={{ marginTop: 4 }}>
                                    Future Topics: <i>"{evItem.futureTopics}"</i>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
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
