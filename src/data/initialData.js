// ============================================
// INITIAL DATA FOR MEDIQUEUE
// ============================================

// Demo users for authentication
export const DEMO_USERS = [
  { email: 'admin@clinic.com', password: 'admin', role: 'admin', name: 'Dr. Sharma', phone: '9876500001' },
  { email: 'patient@clinic.com', password: 'patient', role: 'patient', name: 'Riya Patel', phone: '9876543210' }
];

// Department colors for UI
export const DEPT_COLORS = {
  'General Medicine': '#185FA5',
  'ENT': '#0F6E56',
  'Dental': '#3B6D11',
  'Orthopedic': '#854F0B',
  'Pediatric': '#993556'
};

// Initial department counts
export const INIT_DEPTS = {
  'General Medicine': { count: 0 },
  'ENT': { count: 0 },
  'Dental': { count: 0 },
  'Orthopedic': { count: 0 },
  'Pediatric': { count: 0 }
};

// Initial notifications (empty)
export const INIT_NOTIFS = [];

// Initial follow-ups (empty)
export const INIT_FOLLOWUPS = [];

// WhatsApp message templates
export const WA_TEMPLATES = {
  next: (name, token) => `🔔 Hello ${name}, your token #${token} is next in line! Please be ready.`,
  ready: (name, token) => `✅ ${name}, token #${token} is ready! Please proceed to Room 3.`,
  delay: (name, token) => `⏳ Hi ${name}, there's a small delay for token #${token}. Please wait.`,
  missed: (name, token) => `⚠️ ${name}, you missed token #${token}. Please see front desk.`,
  custom: () => ''
};

// Symptoms list for check-in form
export const SYMPTOMS = [
  'Fever',
  'Headache',
  'Cough',
  'Cold',
  'Nausea',
  'Joint Pain',
  'Chest Pain',
  'Dizziness',
  'Breathing difficulty'
];

// Initial queue data (empty - will load from Supabase)
export const INIT_QUEUE = [];

// Initial departments data
export const INIT_DEPTS_DATA = {
  'General Medicine': 0,
  'ENT': 0,
  'Dental': 0,
  'Orthopedic': 0,
  'Pediatric': 0
};