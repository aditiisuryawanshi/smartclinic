export default function LiveBoardPage({ queue, nsToken, nsMeta }) {
  const sorted = [...queue].sort((a, b) =>
    ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority])
  );

  return (
    <div className="page-enter">

      {/* Now Serving Banner */}
      <div className="now-serving" style={{ marginBottom: 20 }}>
        <div className="ns-eyebrow">NOW SERVING</div>
        <div className="ns-token">#{nsToken}</div>
        <div className="ns-meta">{nsMeta}</div>
      </div>

      {/* Waiting List */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">👥 Waiting Patients</span>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>{queue.length} in queue</span>
        </div>

        {sorted.length === 0 ? (
          <div className="empty-state">Queue is empty 🎉</div>
        ) : (
          sorted.map(p => (
            <div key={p.id} className="queue-row">
              <div className="token-chip normal">#{p.token}</div>
              <div className="q-info">
                <div className="q-name">{p.name}</div>
                <div className="q-meta">{p.dept} · ~{p.wait}min wait</div>
              </div>
              <span className={`prio-tag ${p.priority}`}>{p.priority}</span>
            </div>
          ))
        )}
      </div>

    </div>
  );
}