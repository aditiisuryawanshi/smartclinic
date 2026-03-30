import { useState, useRef } from 'react'
import './App.css'
import { DEMO_USERS, INIT_QUEUE, INIT_DEPTS, INIT_NOTIFS, INIT_FOLLOWUPS, WA_TEMPLATES } from './data/initialData'
import AuthScreen        from './components/AuthScreen'
import TopBar            from './components/TopBar'
import ToastManager      from './components/ToastManager'
import TicketModal       from './components/TicketModal'
import QueuePage         from './components/QueuePage'
import CheckInPage       from './components/CheckInPage'
import NotificationsPage from './components/NotificationsPage'
import FollowUpPage      from './components/FollowUpPage'
import AnalyticsPage     from './components/AnalyticsPage'
import MyTicketPage      from './components/MyTicketPage'
import LiveBoardPage     from './components/LiveBoardPage'

export default function App() {
  const [user,        setUser]        = useState(null)
  const [page,        setPage]        = useState('queue')
  const [queue,       setQueue]       = useState(INIT_QUEUE)
  const [notifLog,    setNotifLog]    = useState(INIT_NOTIFS)
  const [followups,   setFollowups]   = useState(INIT_FOLLOWUPS)
  const [served,      setServed]      = useState(67)
  const [waSent,      setWaSent]      = useState(24)
  const [nextToken,   setNextToken]   = useState(44)
  const [nsToken,     setNsToken]     = useState('42')
  const [nsMeta,      setNsMeta]      = useState('Room 3 · Dr. Sharma · General')
  const [nsBounce,    setNsBounce]    = useState(false)
  const [myTicket,    setMyTicket]    = useState(null)
  const [ticketModal, setTicketModal] = useState(null)
  const [depts,       setDepts]       = useState(INIT_DEPTS)
  const toastRef = useRef(null)

  const toast = (title, body, cls = '') => toastRef.current?.show(title, body, cls)

  const logNotif = (type, name, phone, msg, status = 'sent') => {
    setNotifLog(prev => [
      {
        type, name, phone, msg,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        status
      },
      ...prev
    ].slice(0, 12))
    if (type === 'wa') setWaSent(p => p + 1)
  }

  const callNext = () => {
    if (!queue.length) { toast('Queue empty', 'No patients waiting.'); return }
    const sorted = [...queue].sort((a, b) =>
      ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority])
    )
    const next = sorted[0]
    setNsToken(next.token)
    setNsMeta(`Room 3 · Dr. Sharma · ${next.dept}`)
    setNsBounce(true)
    setTimeout(() => setNsBounce(false), 600)
    logNotif('wa', next.name, next.phone,
      `Hello ${next.name}, token #${next.token} — please proceed to Room 3. 🏥`)
    setQueue(q => q.filter(x => x.id !== next.id))
    setServed(s => s + 1)
    setDepts(d => ({
      ...d,
      [next.dept]: { count: Math.max(0, (d[next.dept]?.count || 0) - 1) }
    }))
    toast(`Token #${next.token} called`, `${next.name} — proceed to Room 3`)
  }

  const servePatient = (id) => {
    const p = queue.find(x => x.id === id)
    if (p) {
      setDepts(d => ({
        ...d,
        [p.dept]: { count: Math.max(0, (d[p.dept]?.count || 0) - 1) }
      }))
    }
    setQueue(q => q.filter(x => x.id !== id))
    setServed(s => s + 1)
  }

  const quickNotify = (id) => {
    const p = queue.find(x => x.id === id)
    if (!p) return
    logNotif('wa', p.name, p.phone,
      `Hello ${p.name}, token #${p.token} almost due! Head to clinic. 🏥`)
    toast('WhatsApp sent', `Notification sent to ${p.name}`, 'wa-toast')
  }

  const doCheckIn = (name, dept, phone, chips) => {
    const urgent = chips.some(s =>
      s.includes('Chest') || s.includes('Breathing') || s.includes('Dizziness'))
    const med = chips.some(s =>
      s.includes('Fever') || s.includes('Nausea')) || chips.length >= 3
    const priority  = urgent ? 'high' : med ? 'medium' : 'low'
    const token     = String(nextToken)
    setNextToken(t => t + 1)
    const pos  = queue.length + 1
    const wait = pos * 8

    setQueue(q => [...q, {
      id: Date.now(), token, name, dept,
      phone: phone || '0000000000',
      priority,
      symptoms: chips.length ? chips : ['General'],
      wait
    }])

    setDepts(d => ({
      ...d,
      [dept]: { count: (d[dept]?.count || 0) + 1 }
    }))

    if (user?.role === 'patient') {
      setMyTicket({ token, name, dept, phone, priority, pos, wait })
    }

    if (phone) {
      logNotif('wa', name, phone,
        `Welcome ${name}! Token #${token} (${dept}) confirmed. Est. wait: ~${wait}min. 🏥`)
    }

    setTicketModal({ token, dept, pos, wait, phone, name })
    toast('Token issued!', `#${token} generated for ${name}`, 'wa-toast')
  }

  if (!user) {
    return (
      <>
        <ToastManager ref={toastRef} />
        <AuthScreen
          onLogin={u => {
            setUser(u)
            setPage(u.role === 'admin' ? 'queue' : 'myticket')
          }}
        />
      </>
    )
  }

  const navItems = user.role === 'admin'
    ? [
        ['queue',         '📋 Queue'],
        ['checkin',       '✅ Check-In'],
        ['notifications', '🔔 Notify'],
        ['followup',      '📩 Follow-Up'],
        ['analytics',     '📊 Analytics'],
      ]
    : [
        ['myticket',  '🎫 My Ticket'],
        ['checkin',   '✅ Check-In'],
        ['livequeue', '👁️ Live Board'],
      ]

  return (
    <div>
      <ToastManager ref={toastRef} />

      <TopBar
        user={user}
        page={page}
        navItems={navItems}
        nsToken={nsToken}
        served={served}
        depts={depts}
        onNav={setPage}
        onLogout={() => setUser(null)}
      />

      <main className="app-main">

        {page === 'queue' && (
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
        )}

        {page === 'checkin' && (
          <CheckInPage
            depts={depts}
            onCheckIn={doCheckIn}
          />
        )}

        {page === 'notifications' && (
          <NotificationsPage
            notifLog={notifLog}
            onSendWA={(n, p, t, type) => {
              const fn  = WA_TEMPLATES[type]
              const msg = fn ? fn(n, t) : ''
              logNotif('wa', n, p, msg)
              toast('WhatsApp sent!', `Delivered to +91 ${p}`, 'wa-toast')
            }}
            onSendSMS={(n, p, t) => {
              logNotif('sms', n, p, `MediQueue: Token #${t} for ${n} — please proceed.`)
              toast('SMS queued', `SMS queued for +91 ${p}`)
            }}
          />
        )}

        {page === 'followup' && (
          <FollowUpPage
            followups={followups}
            onSchedule={fu => {
              setFollowups(f => [fu, ...f])
              logNotif('wa', fu.name, fu.phone,
                `Hi ${fu.name}, your ${fu.type} follow-up is confirmed. — MediQueue`)
              toast('Follow-up scheduled', `Confirmation sent to ${fu.name}`, 'wa-toast')
            }}
          />
        )}

        {page === 'analytics' && (
          <AnalyticsPage
            depts={depts}
            served={served}
            waSent={waSent}
          />
        )}

        {page === 'myticket' && (
          <MyTicketPage
            myTicket={myTicket}
            queue={queue}
            depts={depts}
            onGetTicket={() => setPage('checkin')}
          />
        )}

        {page === 'livequeue' && (
          <LiveBoardPage
            queue={queue}
            nsToken={nsToken}
            nsMeta={nsMeta}
          />
        )}

      </main>

      {ticketModal && (
        <TicketModal
          data={ticketModal}
          onClose={() => setTicketModal(null)}
        />
      )}
    </div>
  )
}