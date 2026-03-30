import { useState } from 'react';

const FOLLOWUP_TYPES = [
  'Post-consultation checkup',
  'Lab results review',
  'Medication follow-up',
  'Wound dressing',
  'Physiotherapy session',
];

export default function FollowUpPage({ followups, onSchedule }) {
  const [name,  setName]  = useState('');
  const [phone, setPhone] = useState('');
  const [date,  setDate]  = useState('');
  const [type,  setType]  = useState(FOLLOWUP_TYPES[0]);
  const [notes, setNotes] = useState('');

  const submit = () => {
    if (!name || !phone || !date) { alert('Please fill in name, phone and date.'); return; }
    onSchedule({ name, phone, date, type, notes, sent: true });
    setName(''); setPhone(''); setDate(''); setNotes('');
  };

  return (
    <div className="page-enter g2">

      {/* Schedule Form */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">📩 Schedule Follow-Up</span>
        </div>

        <div className="form-group">
          <label className="form-label">Patient Name</label>
          <input className="form-input" placeholder="Patient full name" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">WhatsApp Number</label>
          <div className="phone-row">
            <div className="phone-prefix">🇮🇳 +91</div>
            <input className="form-input" type="tel" maxLength={10} placeholder="98765 43210" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Follow-Up Date</label>
          <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Follow-Up Type</label>
          <select className="form-input" value={type} onChange={e => setType(e.target.value)}>
            {FOLLOWUP_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Doctor's Notes</label>
          <textarea
            className="form-input"
            rows={3}
            placeholder="Instructions or notes for patient..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        {/* Auto WA Badge */}
        <div className="wa-badge">
          <span style={{ fontSize: 20 }}>📲</span>
          <div>
            <strong>Auto WhatsApp Reminder</strong>
            <p>A WhatsApp reminder is automatically sent 24 hours before the appointment.</p>
          </div>
        </div>

        <button className="btn btn-primary btn-full btn-lg" onClick={submit}>
          📅 Schedule &amp; Send Confirmation
        </button>
      </div>

      {/* Follow-Ups List */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">📅 Upcoming Follow-Ups</span>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>{followups.length} scheduled</span>
        </div>

        {followups.length === 0 ? (
          <div className="empty-state">No follow-ups scheduled yet.</div>
        ) : (
          followups.map((f, i) => (
            <div key={i} className="followup-item">
              <div className="fu-avatar">📅</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="fu-name">{f.name}</div>
                <div className="fu-meta">
                  {f.type} · {new Date(f.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                {f.notes && (
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{f.notes}</div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 7 }}>
                <span className={`notif-status ${f.sent ? 'sent' : 'pending'}`}>
                  {f.sent ? 'sent' : 'pending'}
                </span>
                <button
                  className="btn btn-wa btn-xs"
                  onClick={() => alert(`Reminder sent to ${f.name} (+91 ${f.phone})`)}
                >
                  Resend
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}