import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Icon, ClientLogo } from '../common/Icons';
import { fmtS } from '../../utils/date';
import { BusinessUpdate } from '../../types';

export const AdminClientsPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { clients, setPreviewAs } = usePortal();
  const clientList = Object.values(clients);

  const overallProgress = (c: any) =>
    Math.round(c.actions.reduce((s: number, x: any) => s + x.progress, 0) / c.actions.length);
  const score = (c: any) => c.scoreHistory[c.scoreHistory.length - 1].v;
  const delayedCount = (c: any) => c.actions.filter((a: any) => a.status === 'Delayed').length;

  const avgProgress = Math.round(
    clientList.reduce((s, c) => s + overallProgress(c), 0) / clientList.length
  );
  const totalDelayed = clientList.reduce((s, c) => s + delayedCount(c), 0);
  const allFeedback = clientList.flatMap((c) => c.feedback);
  const avgRating = allFeedback.length
    ? (allFeedback.reduce((s, f) => s + f.rating, 0) / allFeedback.length).toFixed(1)
    : '0';

  return (
    <>
      <div className="pagehead">
        <div>
          <h1>Client portals</h1>
          <p>
            Each client only ever sees their own portal. Preview a portal to see exactly what the client sees.
          </p>
        </div>
      </div>

      <div className="grid g4" style={{ marginBottom: 20 }}>
        <div className="card kpi">
          <div className="k-lbl">Active clients</div>
          <div className="k-val">{clientList.length}</div>
        </div>
        <div className="card kpi">
          <div className="k-lbl">Avg. progress</div>
          <div className="k-val">
            {avgProgress}
            <small>%</small>
          </div>
        </div>
        <div className="card kpi">
          <div className="k-lbl">Delayed items</div>
          <div className="k-val">{totalDelayed}</div>
        </div>
        <div className="card kpi">
          <div className="k-lbl">Avg. session rating</div>
          <div className="k-val">{avgRating}</div>
        </div>
      </div>

      <div className="card" style={{ padding: '8px 0' }}>
        <div className="tablewrap">
          <table className="t">
            <thead>
              <tr>
                <th>Client</th>
                <th>Consultant</th>
                <th>Month</th>
                <th style={{ width: 160 }}>Progress</th>
                <th>Score</th>
                <th>Pending feedback</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {clientList.map((c) => {
                const prog = overallProgress(c);
                const pendingFb = c.sessions.filter(
                  (s: any) => s.status === 'Completed' && !c.feedback.some((f: any) => f.session === s.id)
                ).length;

                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <ClientLogo client={c} size={32} />
                        <div>
                          <b>{c.company}</b>
                          <div className="tiny muted">
                            {c.id} · {c.industry}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{c.consultant}</td>
                    <td>3 of 6</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div className="progress" style={{ flex: 1 }}>
                          <i style={{ width: `${prog}%` }} />
                        </div>
                        <b className="small">{prog}%</b>
                      </div>
                    </td>
                    <td>{score(c)}</td>
                    <td>{pendingFb}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn sm primary"
                        onClick={() => {
                          setPreviewAs(c.id);
                          onNavigate('dashboard');
                        }}
                      >
                        <Icon name="eye" />
                        Preview portal
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card mt flat">
        <div className="card-head">
          <h3>What consultants manage per client</h3>
        </div>
        <div className="small muted" style={{ maxWidth: '80ch' }}>
          Client records, logos and consultant assignment; the 6-month plan with monthly plans, action items, deadlines and status; sessions and session summaries; reports, documents and photos; business updates, events and notifications; plus feedback and analytics. In this live portal, updates publish in real time with client-level data isolation.
        </div>
      </div>
    </>
  );
};

export const AdminFeedbackPage: React.FC = () => {
  const { clients } = usePortal();
  const rows = Object.values(clients)
    .flatMap((c) =>
      c.feedback.map((f) => ({
        client: c,
        fb: f,
        session: c.sessions.find((s) => s.id === f.session)
      }))
    )
    .sort((a, b) => b.fb.date.localeCompare(a.fb.date));

  return (
    <>
      <div className="pagehead">
        <div>
          <h1>Feedback received</h1>
          <p>Post-session feedback from every client.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '8px 0' }}>
        <div className="tablewrap">
          <table className="t">
            <thead>
              <tr>
                <th>Client</th>
                <th>Session</th>
                <th>Date</th>
                <th>Rating</th>
                <th>Relevance</th>
                <th>Useful / improve</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.client.company}</td>
                  <td>
                    <b>{r.session?.title || r.fb.session}</b>
                  </td>
                  <td>{fmtS(r.fb.date)}</td>
                  <td style={{ color: '#E0A526', whiteSpace: 'nowrap' }}>
                    {'★'.repeat(r.fb.rating)}
                  </td>
                  <td>{r.fb.relevance}</td>
                  <td className="small">
                    {r.fb.useful}
                    {r.fb.improve && <div className="muted">Improve: {r.fb.improve}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export const AdminPublishPage: React.FC = () => {
  const { clients, publishUpdate } = usePortal();
  const [targetCid, setTargetCid] = useState('C001');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<BusinessUpdate['type']>('General Update');
  const [category, setCategory] = useState('Operations');
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError('Add a title and a message before publishing.');
      return;
    }
    setError(null);
    publishUpdate(targetCid, {
      title: title.trim(),
      type,
      cat: category,
      body: body.trim()
    });
    setTitle('');
    setBody('');
  };

  return (
    <>
      <div className="pagehead">
        <div>
          <h1>Publish a business update</h1>
          <p>Updates go to one client only and trigger a notification in their portal.</p>
        </div>
      </div>

      <form className="card" onSubmit={handleSubmit} style={{ maxWidth: 720 }}>
        {error && (
          <div className="err" role="alert">
            {error}
          </div>
        )}

        <div className="field">
          <label htmlFor="pcl">Client</label>
          <select
            className="input"
            id="pcl"
            value={targetCid}
            onChange={(e) => setTargetCid(e.target.value)}
          >
            {Object.values(clients).map((c) => (
              <option key={c.id} value={c.id}>
                {c.company}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="pti">Title</label>
          <input
            className="input"
            id="pti"
            required
            placeholder="e.g. Finance SOPs approved"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid g2" style={{ gap: 16 }}>
          <div className="field">
            <label htmlFor="pty">Type</label>
            <select
              className="input"
              id="pty"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              {[
                'General Update',
                'Important Update',
                'Action Required',
                'Milestone',
                'Recommendation'
              ].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="pca">Category</label>
            <select
              className="input"
              id="pca"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {[
                'Operations',
                'People',
                'Process',
                'Technology',
                'Finance',
                'Performance',
                'Consulting',
                'Reports'
              ].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="pbo">Message</label>
          <textarea
            className="input"
            id="pbo"
            required
            placeholder="What the client needs to know or do"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <button className="btn primary" type="submit">
          <Icon name="send" />
          Publish update
        </button>
      </form>
    </>
  );
};
