import { useEffect, useRef } from 'react';
import { DEPT_COLORS } from '../data/initialData';

function MyQRCode({ ticket }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ticket && typeof QRCode !== 'undefined') {
      ref.current.innerHTML = '';
      new QRCode(ref.current, {
        text: `MEDIQUEUE|TOKEN:${ticket.token}|DEPT:${ticket.dept}`,
        width: 104, height: 104,
        colorDark: '#000000', colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H,
      });
    }
  }, [ticket]);

  return (
    <div className="my-qr-wrap">
      {ticket
        ? <div ref={ref} />
        : <span style={{ fontSize: 12, color: '#94a3b8' }}>No ticket yet</span>
      }
    </div>
  );
}

export default function MyTicketPage({ myTicket, queue, depts, onGetTicket }) {
  const sorted = [...queue].sort((a, b) =>
    ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority])
  );

  return (
    <div className="page-enter g2">

      {/* Left: Ticket Card */}
      <div>
        <div className="my-ticket-card" style={{ marginBottom: 18 }}>
          <div className="mt-eyebrow">YOUR TOKEN</div>
          <div className="mt-token">
            {myTicket ? `#${myTicket.token}` : '—'}
          </div>

          <MyQRCode ticket={myTicket} />

          {myTicket && (
            <div className="ticket-info-row">
              <div className="tic-cell">
                <div className="tic-val">#{myTicket.pos}</div>
                <div className="tic-key">Position</div>
              </div>
              <div className="tic-cell">
                <div className="tic-val">{myTicket.wait}m</div>
                <div className="tic-key">Est. Wait</div>
              </div>
              <div className="tic-cell">
                <div className="tic-val">{myTicket.dept.split(' ')[0]}</div>
                <div className="tic-key">Dept</div>
              </div>
            </div>
          )}

          <div className="wa-badge">
            <span style={{ fontSize: 20 }}>📲</span>
            <div>
              <strong>WhatsApp Alerts ON</strong>
              <p>You'll be notified 2 patients before your turn automatically.</p>
            </div>
          </div>

          <button className="btn btn-primary btn-full" onClick={onGetTicket}>
            {myTicket ? '🔄 Update My Position' : '🎫 Get My Token'}
          </button>
        </div>
      </div>

      {/* Right: Live Queue + Wait Times */}
      <div>
        <div className="panel" style={{ marginBottom: 18 }}>
          <div className="panel-header">
            <span className="panel-title">📋 Live Queue</span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>{queue.length} waiting</span>
          </div>

          {sorted.length === 0 ? (
            <div className="empty-state">Queue is empty 🎉</div>
          ) : (
            sorted.slice(0, 6).map(p => {
              const isMe = myTicket && p.token === myTicket.token;
              return (
                <div key={p.id} className={`queue-row ${isMe ? 'calling' : ''}`}>
                  <div className={`token-chip ${isMe ? 'calling' : 'normal'}`}>
                    #{p.token}
                  </div>
                  <div className="q-info">
                    <div className="q-name" style={isMe ? { color: '#2563eb', fontWeight: 700 } : {}}>
                      {isMe ? `YOU — ${p.name}` : p.name}
                    </div>
                    <div className="q-meta">{p.dept} · ~{p.wait}min</div>
                  </div>
                  <span className={`prio-tag ${p.priority}`}>{p.priority}</span>
                </div>
              );
            })
          )}
        </div>

        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">⏱️ Department Wait Times</span>
          </div>
          {Object.entries(depts).map(([name, d]) => (
            <div key={name} className="dept-row">
              <div className="dept-label">{name}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: DEPT_COLORS[name] || '#2563eb' }}>
                {d.count * 8} min
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}