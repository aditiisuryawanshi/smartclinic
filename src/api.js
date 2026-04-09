// src/api.js - Calls Railway Backend with WhatsApp links

const API_URL = 'https://smartclinic-production-1998.up.railway.app'

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token')
  
  const res = await fetch(`${API_URL}/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    }
  })
  
  const data = await res.json()
  
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong')
  }
  
  return data
}

// Function to open WhatsApp
export const openWhatsApp = (phone, message) => {
  if (!phone) {
    console.error('No phone number provided')
    return
  }
  const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}

export const queueAPI = {
  getAll: () => request('/queue'),
  
  checkin: async (name, dept, phone, symptoms, priority, age) => {
    const result = await request('/checkin', { 
      method: 'POST', 
      body: JSON.stringify({ name, dept, phone, symptoms, priority, age }) 
    })
    
    if (result.whatsappLink) {
      window.open(result.whatsappLink, '_blank')
    }
    
    return result
  },
  
  callNext: async () => {
    const result = await request('/call-next', { method: 'POST' })
    
    if (result.whatsappLink) {
      window.open(result.whatsappLink, '_blank')
    }
    
    return result
  },
  
  sendReminder: async (id) => {
    const result = await request(`/send-reminder/${id}`, { method: 'POST' })
    
    if (result.whatsappLink) {
      window.open(result.whatsappLink, '_blank')
    }
    
    return result
  },
  
  serve: (id) => request(`/serve/${id}`, { method: 'PATCH' })
}

export const feedbackAPI = {
  submit: (patient_name, token, rating, comments) =>
    request('/feedback', { method: 'POST', body: JSON.stringify({ patient_name, token, rating, comments }) }),
  getAll: () => request('/feedback')
}

export const authAPI = {
  login: (email, password) => {
    if (email === 'admin@clinic.com' && password === 'admin') {
      const user = { email, role: 'admin', name: 'Dr. Sharma' }
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', 'demo-token')
      return { user, error: null }
    }
    if (email === 'patient@clinic.com' && password === 'patient') {
      const user = { email, role: 'patient', name: 'Patient' }
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', 'demo-token')
      return { user, error: null }
    }
    return { user: null, error: 'Invalid credentials' }
  },
  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  },
  getUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
}