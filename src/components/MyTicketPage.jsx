import { useRef, useEffect } from 'react'
import { DEPT_COLORS } from '../data/initialData'

export default function MyTicketPage({ myTicket, queue, depts, nsToken, nsMeta, onGetTicket }) {
  const sorted = [...queue].sort((a, b) =>
    ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority])
  )

  return (
    <div className="page-enter g2">
      
      {/* LEFT COLUMN - My Ticket Card */}
      <div>
        {/* NOW SERVING SECTION */}
        <div className="now-serving-mini" style={{
          marginBottom: 20,
          padding: 16,
          background: '#f0f9ff',
          borderRadius: 12,
          textAlign: 'center',
          border: '1px solid #bfdbfe'
        }}>
          <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, letterSpacing: 1 }}>
            🔔 NOW SERVING
          </div>
          <div style={{ fontSize: 48, fontWeight: 'bold', color: '#2563eb', lineHeight: 1 }}>
            #{nsToken || '--'}
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
            {nsMeta || 'Room 3 · Dr. Sharma'}
          </div>
        </div>

        {/* MY TICKET CARD */}
        <div className="my-ticket-card" style={{ marginBottom: 18 }}>
          <div className="mt-eyebrow">YOUR TOKEN</div>
          <div className="mt-token">{myTicket ? `#${myTicket.token}` : "—"}</div>
          
          {/* QR Code for my ticket */}
          {myTicket && <MyQR ticket={myTicket} />}
          
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
                <div className="tic-val">{myTicket.dept?.split(' ')[0]}</div>
                <div className="tic-key">Dept</div>
              </div>
            </div>
          )}
          
          <div className="wa-badge">
            <span>📲</span>
            <div>
              <strong>WhatsApp Alerts ON</strong>
              <p>You'll be notified 2 patients before your turn automatically.</p>
            </div>
          </div>
          
          <button className="btn btn-primary btn-full" onClick={onGetTicket}>
            {myTicket ? "🔄 Update My Position" : "🎫 Get My Token"}
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN - Live Queue */}
      <div>
        <div className="panel" style={{ marginBottom: 18 }}>
          <div className="panel-header">
            <span className="panel-title">📋 Live Queue</span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>{queue.length} waiting</span>
          </div>
          
          {sorted.length === 0 ? (
            <div className="empty-state">Queue is empty 🎉</div>
          ) : (
            sorted.slice(0, 10).map(p => {
              const isMe = myTicket && p.token === myTicket.token
              return (
                <div key={p.id} className={`queue-row ${isMe ? 'calling' : ''}`}>
                  <div className={`token-chip ${isMe ? 'calling' : 'normal'}`}>
                    #{p.token}
                  </div>
                  <div className="q-info">
                    <div className="q-name" style={isMe ? { color: '#2563eb', fontWeight: 700 } : {}}>
                      {isMe ? `YOU — ${p.name}` : p.name}
                    </div>
                    <div className="q-meta">
                      {p.dept} · ~{p.wait}min wait
                    </div>
                  </div>
                  <span className={`prio-tag ${p.priority}`}>{p.priority}</span>
                </div>
              )
            })
          )}
        </div>

        {/* Department Wait Times */}
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
  )
}

// QR Component for my ticket
function MyQR({ ticket }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (ticket && canvasRef.current) {
      // Dynamic import to avoid issues
      import('qrcode').then((QRCodeModule) => {
        const qrData = JSON.stringify({
          token: ticket.token,
          name: ticket.name,
          department: ticket.dept
        })
        QRCodeModule.toCanvas(canvasRef.current, qrData, {
          width: 104,
          margin: 2,
          color: { dark: '#1a365d', light: '#ffffff' }
        }).catch(err => console.error('QR Error:', err))
      }).catch(err => console.error('Failed to load QR library:', err))
    }
  }, [ticket])

  if (!ticket) return <div className="my-qr-wrap">No ticket yet</div>
  
  return (
    <div className="my-qr-wrap">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}></canvas>
    </div>
  )
}