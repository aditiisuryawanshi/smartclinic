export const DEMO_USERS = [
  { email: 'admin@clinic.com',   pass: 'admin',   role: 'admin',
    name: 'Dr. Sharma',  phone: '9876500001' },
  { email: 'patient@clinic.com', pass: 'patient', role: 'patient',
    name: 'Riya Patel',  phone: '9876543210' },
];

export const DEPT_COLORS = {
  'General Medicine': '#185FA5',
  'ENT':              '#0F6E56',
  'Dental':           '#3B6D11',
  'Orthopedic':       '#854F0B',
  'Pediatric':        '#993556',
};

export const INIT_QUEUE = [
  { id: 1, token: '38', name: 'Arun Kumar',   dept: 'ENT',
    phone: '9876511111', priority: 'medium', symptoms: ['Headache'], wait: 28 },
  { id: 2, token: '39', name: 'Sneha Joshi',  dept: 'Dental',
    phone: '9876522222', priority: 'low',    symptoms: ['Toothache'], wait: 20 },
  { id: 3, token: '40', name: 'Vikram Singh', dept: 'General Medicine',
    phone: '9876533333', priority: 'high',   symptoms: ['Chest pain'], wait: 5 },
  { id: 4, token: '41', name: 'Priya Mehta',  dept: 'Pediatric',
    phone: '9876544444', priority: 'medium', symptoms: ['Fever'], wait: 42 },
];

export const INIT_DEPTS = {
  'General Medicine': { count: 6 },
  'ENT':              { count: 2 },
  'Dental':           { count: 2 },
  'Orthopedic':       { count: 1 },
  'Pediatric':        { count: 1 },
};

export const INIT_NOTIFS = [
  { type: 'wa',  name: 'Arun Kumar',  phone: '9876511111',
    msg: "You're next! Token #38 — Room 1.", time: '10:32 AM', status: 'sent' },
  { type: 'sms', name: 'Sneha Joshi', phone: '9876522222',
    msg: 'Token #39 — your turn in ~10 min.', time: '10:28 AM', status: 'sent' },
];

export const INIT_FOLLOWUPS = [
  { name: 'Arun Kumar', phone: '9876511111', date: '2026-03-10',
    type: 'Lab results review', notes: 'Check CBC and ESR', sent: true },
  { name: 'Priya Mehta', phone: '9876544444', date: '2026-03-08',
    type: 'Medication follow-up', notes: 'Continue antibiotics', sent: false },
];

export const WA_TEMPLATES = {
  next:   (n, t) => `Hello ${n}, your token *#${t}* is almost due! Head to clinic now. 🏥 — MediQueue`,
  ready:  (n, t) => `${n}, it's your turn! Proceed to the room. Token *#${t}* 🔔 — MediQueue`,
  delay:  (n, t) => `Hi ${n}, small delay for *#${t}*. Please stay seated. ⏳ — MediQueue`,
  missed: (n, t) => `Hi ${n}, you missed token *#${t}*. Visit front desk to re-queue. — MediQueue`,
  custom: ()     => document.getElementById('customMsgTA')?.value || '',
};

export const SYMPTOMS = [
  'Fever', 'Headache', 'Breathing difficulty',
  'Nausea', 'Joint pain', 'Chest pain', 'Dizziness', 'Cold/Cough',
];