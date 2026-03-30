import { DEPT_COLORS } from '../data/initialData';

export default function QueuePage({
  queue, served, waSent, depts,
  nsToken, nsMeta, nsBounce,
  onCallNext, onServe, onNotify, onGotoCheckin
}) {
  const sorted = [...queue].sort((a, b) =>
    ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority])
  );

  const totalDepts = Object.values(depts).reduce((a, d) => a + d.count, 0) || 1;

  return (
    <div className="page-enter">

      {/* Stat Cards */}
      <div className="g4">
        <div className="stat-card blue">
          <div className="s-icon">👥</div>
          <div className="s-val blue">{queue.length}</div>
          <div className="s-lbl">In Queue</div>
        </div>
        <div className="stat-card teal">
          <div className="s-icon">⏱️</div>
          <div className="s-val teal">18<small>m</small></div>
          <div className="s-lbl">Avg Wait</div>
        </div>
        <div className="stat-card orange">
          <div className="s-icon">✅</div>
          <div className="s-val orange">{served}</div>
          <div className="s-lbl">Served Today</div>
        </div>
        <div className="stat-card green">
          <div className="s-icon">💬</div>
          <div className="s-val green">{waSent}</div>
          <div className="s-lbl">WA Sent</div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="g-main">

        {/* Queue List */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Active Queue</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={onCallNext}>
                📢 Call Next
              </button>
              <button className="btn btn-ghost btn-sm" onClick={onGotoCheckin}>
                ➕ Add Patient
              </button>
            </div>
          </div>

          {sorted.length === 0 ? (
            <div className="empty-state">🎉 Queue is empty!</div>
          ) : (
            sorted.map(p => (
              <div key={p.id} className={`queue-row ${p.priority === 'high' ? 'urgent' : ''}`}>
                <div className={`token-chip ${p.priority === 'high' ? 'urgent' : 'normal'}`}>
                  #{p.token}
                </div>
                <div className="q-info">
                  <div className="q-name">{p.name}</div>
                  <div className="q-meta">
                    {p.dept} · {p.symptoms.join(', ')} · ~{p.wait}min
                  </div>
                </div>
                <span className={`prio-tag ${p.priority}`}>{p.priority}</span>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => onNotify(p.id)}
                  title="Send WhatsApp"
                >
                  💬
                </button>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => onServe(p.id)}
                  title="Mark as served"
                >
                  ✓
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right Column */}
        <div>
          {/* Now Serving */}
          <div className="now-serving" style={{ marginBottom: 18 }}>
            <div className="ns-eyebrow">NOW SERVING</div>
            <div className={`ns-token ${nsBounce ? 'bounce' : ''}`}>#{nsToken}</div>
            <div className="ns-meta">{nsMeta}</div>
          </div>

          {/* Dept Load */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Department Load</span>
            </div>
            {Object.entries(depts).map(([name, d]) => (
              <div key={name} className="dept-row">
                <div className="dept-label">{name}</div>
                <div className="dept-bar-bg">
                  <div
                    className="dept-bar"
                    style={{
                      width: `${Math.min((d.count / totalDepts) * 100, 100)}%`,
                      background: DEPT_COLORS[name] || '#2563eb',
                    }}
                  />
                </div>
                <div className="dept-count" style={{ color: DEPT_COLORS[name] || '#2563eb' }}>
                  {d.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}