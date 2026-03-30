import { DEPT_COLORS } from '../data/initialData';

const HOURS  = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const VOLUME = [3, 8, 15, 18, 12, 6, 9, 16, 14, 10, 5, 2];
const MAX_VOL = Math.max(...VOLUME);

export default function AnalyticsPage({ depts, served, waSent }) {
  const total = Object.values(depts).reduce((a, d) => a + d.count, 0) || 1;

  return (
    <div className="page-enter">

      {/* KPI Row */}
      <div className="g4" style={{ marginBottom: 22 }}>
        <div className="stat-card teal">
          <div className="s-icon">⏱️</div>
          <div className="s-val teal">18<small>m</small></div>
          <div className="s-lbl">Avg Wait Time</div>
        </div>
        <div className="stat-card green">
          <div className="s-icon">😊</div>
          <div className="s-val green">94<small>%</small></div>
          <div className="s-lbl">Satisfaction Rate</div>
        </div>
        <div className="stat-card orange">
          <div className="s-icon">💬</div>
          <div className="s-val orange">{waSent}</div>
          <div className="s-lbl">WA Delivered</div>
        </div>
        <div className="stat-card red">
          <div className="s-icon">🚫</div>
          <div className="s-val red">3</div>
          <div className="s-lbl">No-Shows</div>
        </div>
      </div>

      <div className="g2">

        {/* Heatmap */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">📊 Hourly Volume Heatmap</span>
          </div>

          <div className="heatmap-grid">
            {VOLUME.map((v, i) => (
              <div
                key={i}
                className="heatmap-cell"
                style={{ background: `rgba(37,99,235,${0.1 + (v / MAX_VOL) * 0.85})` }}
                title={`${HOURS[i]}:00 — ${v} patients`}
              />
            ))}
          </div>

          <div className="heatmap-labels">
            {HOURS.map(h => <div key={h} className="heatmap-lbl">{h}</div>)}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: '#64748b', marginTop: 12 }}>
            {[
              { label: 'Low',    bg: 'rgba(37,99,235,0.15)' },
              { label: 'Medium', bg: 'rgba(37,99,235,0.55)' },
              { label: 'Peak',   bg: '#2563eb'              },
            ].map(({ label, bg }) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 11, height: 11, borderRadius: 3, background: bg, display: 'inline-block' }} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Dept Breakdown */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">🏥 Department Breakdown</span>
          </div>
          {Object.entries(depts).map(([name, d]) => (
            <div key={name} className="dept-row">
              <div className="dept-label">{name}</div>
              <div className="dept-bar-bg" style={{ width: 140 }}>
                <div
                  className="dept-bar"
                  style={{
                    width: `${(d.count / total) * 100}%`,
                    background: DEPT_COLORS[name] || '#2563eb',
                  }}
                />
              </div>
              <div className="dept-count" style={{ color: DEPT_COLORS[name] || '#2563eb', width: 34 }}>
                {Math.round((d.count / total) * 100)}%
              </div>
            </div>
          ))}

          {/* Summary */}
          <div style={{ marginTop: 20, padding: '16px', background: '#f7faff', borderRadius: 12, border: '1px solid #d4e4f7' }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, fontWeight: 600 }}>TODAY'S SUMMARY</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Total Served', val: served },
                { label: 'Currently Waiting', val: Object.values(depts).reduce((a, d) => a + d.count, 0) },
                { label: 'WA Notifications', val: waSent },
                { label: 'Avg Per Hour', val: Math.round(served / 8) },
              ].map(({ label, val }) => (
                <div key={label} style={{ textAlign: 'center', padding: '10px 8px', background: 'white', borderRadius: 9, border: '1px solid #d4e4f7' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#2563eb' }}>{val}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}