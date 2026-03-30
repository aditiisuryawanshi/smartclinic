import { useEffect, useRef } from 'react';

export default function TicketModal({ data, onClose }) {
  const qrRef = useRef(null);

  useEffect(() => {
    if (qrRef.current && data && typeof QRCode !== 'undefined') {
      qrRef.current.innerHTML = '';
      new QRCode(qrRef.current, {
        text: `MEDIQUEUE|TOKEN:${data.token}|DEPT:${data.dept}|NAME:${data.name}|DATE:${new Date().toISOString().split('T')[0]}`,
        width: 120,
        height: 120,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H,
      });
    }
  }, [data]);

  if (!data) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div className="modal-clinic">Medi<span>Queue</span></div>
            <div className="modal-date">
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
          <span style={{ fontSize: 30 }}>🏥</span>
        </div>

        {/* Token */}
        <div className="modal-token-label">YOUR TOKEN NUMBER</div>
        <div className="modal-token">#{data.token}</div>

        {/* QR Code */}
        <div className="qr-wrap">
          <div ref={qrRef} />
        </div>

        {/* Info Row */}
        <div className="ticket-info-row">
          <div className="tic-cell">
            <div className="tic-val">{data.dept.split(' ')[0]}</div>
            <div className="tic-key">Department</div>
          </div>
          <div className="tic-cell">
            <div className="tic-val">#{data.pos}</div>
            <div className="tic-key">Position</div>
          </div>
          <div className="tic-cell">
            <div className="tic-val">{data.wait}m</div>
            <div className="tic-key">Est. Wait</div>
          </div>
        </div>

        <div className="modal-divider" />

        {/* WA Badge */}
        <div className="wa-badge">
          <span style={{ fontSize: 20 }}>💬</span>
          <div>
            <strong>WhatsApp confirmation sent!</strong>
            <p>
              {data.phone
                ? `Booking confirmation sent to +91 ${data.phone}`
                : 'Save this QR code for entry verification.'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button className="btn btn-primary btn-full" onClick={onClose}>
            ✓ Done
          </button>
          <button className="btn btn-outline btn-full" onClick={() => window.print()}>
            🖨️ Print
          </button>
        </div>

      </div>
    </div>
  );
}