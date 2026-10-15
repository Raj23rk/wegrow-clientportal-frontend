import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { fmt } from '../../utils/date';

interface FeedbackPageProps {
  onGiveFeedback: (sessionId: string) => void;
}

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ onGiveFeedback }) => {
  const { client } = usePortal();
  if (!client) return null;

  const pendingFeedbackList = client.sessions.filter(
    (s) => s.status === 'Completed' && !client.feedback.some((f) => f.session === s.id)
  );

  const submittedFeedback = [...client.feedback].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <div className="pagehead">
        <div>
          <h1>Session feedback</h1>
          <p>Your ratings shape how we run the next session. Only your WeGrow team sees them.</p>
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
        <div className="card-head">
          <h3>Submitted feedback</h3>
        </div>
        {submittedFeedback.length > 0 ? (
          submittedFeedback.map((f, idx) => {
            const s = client.sessions.find((x) => x.id === f.session);
            return (
              <div key={idx} className="li" style={{ alignItems: 'flex-start' }}>
                <div className="grow">
                  <div className="row-between">
                    <div className="ttl">{s ? s.title : f.session}</div>
                    <span style={{ color: '#E0A526', whiteSpace: 'nowrap' }}>
                      {'★'.repeat(f.rating)}
                      <span style={{ color: 'var(--line-2)' }}>{'★'.repeat(5 - f.rating)}</span>
                    </span>
                  </div>
                  <div className="sub">
                    {fmt(f.date)} · {f.relevance}
                  </div>
                  {f.useful && (
                    <div className="small" style={{ marginTop: 6 }}>
                      <b>Useful:</b> {f.useful}
                    </div>
                  )}
                  {f.improve && (
                    <div className="small">
                      <b>Improve:</b> {f.improve}
                    </div>
                  )}
                  {f.comments && <div className="small muted">{f.comments}</div>}
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty">
            <b>No feedback yet</b>
            Rate a completed session to see it here.
          </div>
        )}
      </div>
    </>
  );
};
