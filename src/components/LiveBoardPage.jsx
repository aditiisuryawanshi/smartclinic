export default function LiveBoardPage({ queue, nsToken, nsMeta }) {
  const sorted = [...queue].sort((a, b) =>
    ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority])
  )

  return (
    <div className="page-enter">
      {/* Now Serving - Large Display for Live Board */}
      <div className="now-serving" style={{ marginBottom: 24, textAlign: 'center', padding: '32px' }}>
        <div className="ns-eyebrow" style={{ fontSize: '14px', letterSpacing: '4px' }}>🔔 NOW SERVING</div>
        <div className="ns-token" style={{ fontSize: '120px', fontWeight: 'bold' }}>#{nsToken || '--'}</div>
        <div className="ns-meta" style={{ fontSize: '16px', color: '#64748b' }}>{nsMeta || 'Please wait'}</div>
      </div>

      {/* Queue List */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">👥 Waiting Patients</span>
          <span style={{ fontSize: 14, color: '#94a3b8' }}>{queue.length} in queue</span>
        </div>

        {sorted.length === 0 ? (
          <div className="empty-state">🎉 Queue is empty!</div>
        ) : (
          <div style={{ display: 'grid', gap: '8px' }}>
            {sorted.slice(0, 15).map(p => (
              <div key={p.id} className="queue-row">
                <div className="token-chip normal" style={{ minWidth: '60px', textAlign: 'center' }}>
                  #{p.token}
                </div>
                <div className="q-info">
                  <div className="q-name">{p.name}</div>
                  <div className="q-meta">
                    {p.dept} · ~{p.wait} min wait
                  </div>
                </div>
                <span className={`prio-tag ${p.priority}`}>{p.priority}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}