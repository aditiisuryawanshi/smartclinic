import { useState, useRef, useEffect } from 'react'
import { queueAPI, authAPI } from "./api";
import Feedback from './components/Feedback'
import './App.css'
import { INIT_DEPTS, INIT_NOTIFS, INIT_FOLLOWUPS, WA_TEMPLATES, SYMPTOMS, DEPT_COLORS } from './data/initialData';
import AuthScreen from './components/AuthScreen'
import TopBar from './components/TopBar'
import ToastManager from './components/ToastManager'
import TicketModal from './components/TicketModal'
import QueuePage from './components/QueuePage'
import CheckInPage from './components/CheckInPage'
import NotificationsPage from './components/NotificationsPage'
import FollowUpPage from './components/FollowUpPage'
import AnalyticsPage from './components/AnalyticsPage'
import MyTicketPage from './components/MyTicketPage'
import LiveBoardPage from './components/LiveBoardPage'

export default function App() {
  const [user, setUser] = useState(authAPI.getUser())
  const [page, setPage] = useState('queue')
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [notifLog, setNotifLog] = useState(INIT_NOTIFS)
  const [followups, setFollowups] = useState(INIT_FOLLOWUPS)
  const [served, setServed] = useState(0)
  const [waSent, setWaSent] = useState(0)
  const [nsToken, setNsToken] = useState('--')
  const [nsMeta, setNsMeta] = useState('Waiting for patient')
  const [nsBounce, setNsBounce] = useState(false)
  const [myTicket, setMyTicket] = useState(null)
  const [ticketModal, setTicketModal] = useState(null)
  const [depts, setDepts] = useState(INIT_DEPTS)
  const toastRef = useRef(null)

  const toast = (title, body, cls = '') => toastRef.current?.show(title, body, cls)

  // Load queue from Supabase
  const loadQueue = async () => {
    try {
      const data = await queueAPI.getAll()
      setQueue(data)
      // Update department counts
      const newDepts = { ...INIT_DEPTS }
      data.forEach(p => {
        if (newDepts[p.dept]) newDepts[p.dept].count++
      })
      setDepts(newDepts)
    } catch (error) {
      console.error('Failed to load queue:', error)
    } finally {
      setLoading(false)
    }
  }


  const callNext = async () => {
    if (!queue.length) {
      toast('Queue empty', 'No patients waiting.')
      return
    }
    try {
      const next = await queueAPI.callNext()
      setNsToken(next.token)
      setNsMeta(`Room 3 · Dr. Sharma · ${next.dept}`)
      setNsBounce(true)
      setTimeout(() => setNsBounce(false), 600)
      await loadQueue()
      setServed(s => s + 1)
      toast(`Token #${next.token} called`, `WhatsApp opened for ${next.name}`, 'wa-toast')
    } catch (error) {
      toast('Error', error.message, 'alert-toast')
    }
  }

  const servePatient = async (id) => {
    try {
      await queueAPI.serve(id)
      await loadQueue()
      setServed(s => s + 1)
      toast('Patient served', 'Marked as completed', '')
    } catch (error) {
      toast('Error', error.message, 'alert-toast')
    }
  }

  const quickNotify = (id) => {
    const p = queue.find(x => x.id === id)
    if (!p) return
    const message = `🏥 Reminder: Token #${p.token} for ${p.name} is coming up soon!`
    window.open(`https://wa.me/91${p.phone}?text=${encodeURIComponent(message)}`)
    toast('WhatsApp opened!', `Reminder sent to ${p.name}`, 'wa-toast')
  }

  const doCheckIn = async (name, dept, phone, chips) => {
    const urgent = chips.some(s => s.includes('Chest') || s.includes('Breathing') || s.includes('Dizziness'))
    const med = chips.some(s => s.includes('Fever') || s.includes('Nausea')) || chips.length >= 3
    const priority = urgent ? 'high' : med ? 'medium' : 'low'

    try {
      const newPatient = await queueAPI.checkin(name, dept, phone || '0000000000', chips, priority, null)
      await loadQueue()
      const pos = queue.length + 1
      const wait = pos * 8
      setTicketModal({ token: newPatient.token, dept, pos, wait, phone, name })
      toast('Token issued!', `#${newPatient.token} generated for ${name}`, 'wa-toast')
    } catch (error) {
      toast('Error', error.message, 'alert-toast')
    }
  }

  const handleLogout = () => {
    authAPI.logout()
    setUser(null)
    setPage('queue')
  }

  if (!user) {
    return (
      <>
        <ToastManager ref={toastRef} />
        <AuthScreen onLogin={(u) => { setUser(u); setPage(u.role === 'admin' ? 'queue' : 'myticket') }} />
      </>
    )
  }

  const navItems = user.role === 'admin'
    ? [['queue', '📋 Queue'], ['checkin', '✅ Check-In'], ['notifications', '🔔 Notify'], ['followup', '📩 Follow-Up'], ['analytics', '📊 Analytics']]
    : [['myticket', '🎫 My Ticket'], ['checkin', '✅ Check-In'], ['livequeue', '👁️ Live Board']]

  return (
    <div>
      <ToastManager ref={toastRef} />
      <TopBar user={user} page={page} navItems={navItems} nsToken={nsToken} served={served} depts={depts} onNav={setPage} onLogout={handleLogout} />
      <main className="app-main">
        {page === 'queue' && (
          <div className="g-main">
            <div style={{ flex: 1 }}>
              <QueuePage
                queue={queue}
                served={served}
                waSent={waSent}
                depts={depts}
                nsToken={nsToken}
                nsMeta={nsMeta}
                nsBounce={nsBounce}
                onCallNext={callNext}
                onServe={servePatient}
                onNotify={quickNotify}
                onGotoCheckin={() => setPage('checkin')}
              />
            </div>
            <div className="feedback-sidebar-container">
              <Feedback />
            </div>
          </div>
        )}
        {page === 'checkin' && (
          <div className="g-main">
            <div style={{ flex: 1 }}>
              <CheckInPage depts={depts} onCheckIn={doCheckIn} />
            </div>
            <div className="feedback-sidebar-container">
              <Feedback />
            </div>
          </div>
        )}
        {page === 'notifications' && <NotificationsPage notifLog={notifLog} onSendWA={() => {}} onSendSMS={() => {}} />}
        {page === 'followup' && <FollowUpPage followups={followups} onSchedule={() => {}} />}
        {page === 'analytics' && <AnalyticsPage depts={depts} served={served} waSent={waSent} />}
        {page === 'myticket' && <MyTicketPage myTicket={myTicket} queue={queue} depts={depts} nsToken={nsToken} nsMeta={nsMeta} onGetTicket={() => setPage('checkin')} />}
        {page === 'livequeue' && <LiveBoardPage queue={queue} nsToken={nsToken} nsMeta={nsMeta} />}
      </main>
      {ticketModal && <TicketModal data={ticketModal} onClose={() => setTicketModal(null)} />}
    </div>
  )
}