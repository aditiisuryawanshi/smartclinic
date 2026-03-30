import { useState, useEffect, useRef } from 'react';
import { DEPT_COLORS, SYMPTOMS } from '../data/initialData';

function RemoteQR() {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && typeof QRCode !== 'undefined') {
      ref.current.innerHTML = '';
      new QRCode(ref.current, {
        text: 'https://mediqueue.app/checkin',
        width: 114, height: 114,
        colorDark: '#000000', colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H,
      });
    }
  }, []);
  return <div ref={ref} />;
}

function getTriageLevel(chips) {
  if (!chips.length) return null;
  const urgent = chips.some(s => s.includes('Chest') || s.includes('Breathing') || s.includes('Dizziness'));
  const med    = chips.some(s => s.includes('Fever') || s.includes('Nausea')) || chips.length >= 3;
  if (urgent) return { level: 'high',   title: '🔴 Urgent — High Priority', desc: 'Critical symptoms detected! You will be prioritized immediately. Please inform the front desk.' };
  if (med)    return { level: 'medium', title: '🟡 Medium Priority',         desc: "Moderate symptoms. You'll be seen within 15–25 minutes." };
  return       { level: 'low',    title: '🟢 Low Priority',           desc: 'Mild symptoms. Estimated wait: 30–45 minutes. Please remain seated.' };
}

export default function CheckInPage({ depts, onCheckIn }) {
  const [name,  setName]  = useState('');
  const [age,   setAge]   = useState('');
  const [phone, setPhone] = useState('');
  const [dept,  setDept]  = useState('');
  const [chips, setChips] = useState([]);

  const toggleChip = s => setChips(c => c.includes(s) ? c.filter(x => x !== s) : [...c, s]);
  const triage = getTriageLevel(chips);

  const submit = () => {
    if (!name || !dept) { alert('Please fill in name and department.'); return; }
    onCheckIn(name, dept, phone, chips);
    setName(''); setAge(''); setPhone(''); setDept(''); setChips([]);
  };

  return (
    <div className="page-enter g2">

      {/* Check-In Form */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">✅ Patient Check-In</span>
        </div>

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className="form-input" placeholder="Patient full name" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Age</label>
          <input className="form-input" type="number" placeholder="Age" min={1} max={120} value={age} onChange={e => setAge(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">WhatsApp Number</label>
          <div className="phone-row">
            <div className="phone-prefix">🇮🇳 +91</div>
            <input className="form-input" type="tel" placeholder="98765 43210" maxLength={10} value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Department</label>
          <select className="form-input" value={dept} onChange={e => setDept(e.target.value)}>
            <option value="">Select Department</option>
            {Object.keys(depts).map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Symptoms (select all that apply)</label>
          <div className="chip-wrap">
            {SYMPTOMS.map(s => (
              <div
                key={s}
                className={`chip ${chips.includes(s) ? 'selected' : ''}`}
                onClick={() => toggleChip(s)}
              >
                {s}
              </div>
            ))}
          </div>

          {/* AI Triage Result */}
          {triage && (
            <div className={`triage-box ${triage.level}`}>
              <div className="triage-title">{triage.title}</div>
              <div className="triage-desc">{triage.desc}</div>
            </div>
          )}
        </div>

        <button className="btn btn-primary btn-full btn-lg" onClick={submit}>
          🎫 Confirm &amp; Generate QR Token
        </button>
      </div>

      {/* Right Panel */}
      <div>
        {/* Wait Times */}
        <div className="panel" style={{ marginBottom: 18 }}>
          <div className="panel-header">
            <span className="panel-title">⏱️ Current Wait Times</span>
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

        {/* Remote QR */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">📱 Remote Check-In</span>
          </div>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12, lineHeight: 1.5 }}>
            Patients can scan this QR code to join the queue from home and arrive just before their turn.
          </p>
          <div style={{ background: 'white', width: 134, height: 134, borderRadius: 13, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #d4e4f7' }}>
            <RemoteQR />
          </div>
          <p style={{ textAlign: 'center', fontSize: 10, color: '#94a3b8', marginTop: 8, fontFamily: 'monospace' }}>
            mediqueue.app/checkin
          </p>
        </div>
      </div>
    </div>
  );
}