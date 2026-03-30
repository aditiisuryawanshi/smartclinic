import { useState } from 'react';
import { WA_TEMPLATES } from '../data/initialData';

const MSG_TYPES = [
  { value: 'next',   label: "🔔 You're next in queue"       },
  { value: 'ready',  label: '✅ Please come to room now'     },
  { value: 'delay',  label: '⏳ Small delay — please wait'   },
  { value: 'missed', label: '⚠️ Missed turn — re-queue?'     },
  { value: 'custom', label: '✏️ Custom message'              },
];

const NOTIF_ICONS = { wa: '💬', sms: '📱', sys: '⚙️' };
const NOTIF_CLS   = { wa: 'wa', sms: 'sms', sys: 'sys' };

export default function NotificationsPage({ notifLog, onSendWA, onSendSMS }) {
  const [nToken,    setNToken]    = useState('');
  const [nName,     setNName]     = useState('');
  const [nPhone,    setNPhone]    = useState('');
  const [nType,     setNType]     = useState('next');
  const [customMsg, setCustomMsg] = useState('');

  const getPreview = () => {
    if (nType === 'custom') return customMsg || '[Your custom message here]';
    const fn = WA_TEMPLATES[nType];
    return fn ? fn(nName || '[Patient]', nToken || '#XX') : '';
  };

  const validate = () => {
    if (!nName || !nPhone || !nToken) { alert('Please fill in token, name and phone number.'); return false; }
    return true;
  };

  return (
    <div className="page-enter g2">

      {/* Send Panel */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">💬 Send Notification</span>
        </div>

        <div className="form-group">
          <label className="form-label">Token Number</label>
          <input className="form-input" placeholder="e.g. 42" value={nToken} onChange={e => setNToken(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Patient Name</label>
          <input className="form-input" placeholder="Patient name" value={nName} onChange={e => setNName(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">WhatsApp Number</label>
          <div className="phone-row">
            <div className="phone-prefix">🇮🇳 +91</div>
            <input className="form-input" type="tel" maxLength={10} placeholder="98765 43210" value={nPhone} onChange={e => setNPhone(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Message Type</label>
          <select className="form-input" value={nType} onChange={e => setNType(e.target.value)}>
            {MSG_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        {nType === 'custom' && (
          <div className="form-group">
            <label className="form-label">Custom Message</label>
            <textarea
              id="customMsgTA"
              className="form-input"
              rows={3}
              placeholder="Type your message..."
              value={customMsg}
              onChange={e => setCustomMsg(e.target.value)}
            />
          </div>
        )}

        {/* WA Preview */}
        <div className="wa-preview">
          <div className="wa-preview-header">
            <span>📱</span> WHATSAPP PREVIEW
          </div>
          <div className="wa-bubble">
            <div className="wa-sender">MediQueue Clinic</div>
            <div className="wa-text">{getPreview()}</div>
            <div className="wa-time">✓✓ Just now</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button className="btn btn-wa btn-full" onClick={() => validate() && onSendWA(nName, nPhone, nToken, nType)}>
            📲 Send WhatsApp
          </button>
          <button className="btn btn-outline btn-full" onClick={() => validate() && onSendSMS(nName, nPhone, nToken)}>
            💬 Send SMS
          </button>
        </div>
      </div>

      {/* Log Panel */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">📋 Notification Log</span>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>{notifLog.length} sent</span>
        </div>

        {notifLog.length === 0 ? (
          <div className="empty-state">No notifications sent yet.</div>
        ) : (
          notifLog.slice(0, 10).map((n, i) => (
            <div key={i} className="notif-item">
              <div className={`notif-icon ${NOTIF_CLS[n.type]}`}>
                {NOTIF_ICONS[n.type]}
              </div>
              <div className="notif-body">
                <div className="notif-name">{n.name} · +91 {n.phone}</div>
                <div className="notif-msg">{n.msg.substring(0, 62)}…</div>
                <div className="notif-time">{n.time}</div>
              </div>
              <span className={`notif-status ${n.status}`}>{n.status}</span>
            </div>
          ))
        )}
      </div>

    </div>
  );
}