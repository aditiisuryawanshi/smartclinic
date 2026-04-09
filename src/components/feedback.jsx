import { useState, useEffect } from 'react'

export default function Feedback() {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comments, setComments] = useState('')
  const [patientName, setPatientName] = useState('')
  const [feedbacks, setFeedbacks] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    loadFeedbacks()
  }, [])

  const loadFeedbacks = async () => {
    try {
      const response = await fetch('https://smartclinic-production-e926.up.railway.app/api/feedback')
      const data = await response.json()
      setFeedbacks(data)
    } catch (error) {
      console.error('Failed to load feedbacks:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) return
    setSubmitting(true)

    try {
      await fetch('https://smartclinic-production-e926.up.railway.app/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: patientName || 'Anonymous',
          rating,
          comments
        })
      })
      setSubmitted(true)
      setRating(0)
      setComments('')
      setPatientName('')
      loadFeedbacks()
      setTimeout(() => setSubmitted(false), 3000)
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    }
    setSubmitting(false)
  }

  return (
    <div className="feedback-sidebar">
      <h3>💬 Patient Feedback</h3>
      {submitted && <div className="success-msg">✅ Thank you for your feedback! 💙</div>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Your name (optional)" 
          value={patientName} 
          onChange={(e) => setPatientName(e.target.value)} 
          className="form-input" 
          style={{ marginBottom: 10, width: '100%' }}
        />
        <div className="stars" style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          {[1, 2, 3, 4, 5].map(star => (
            <span 
              key={star} 
              onClick={() => setRating(star)} 
              onMouseEnter={() => setHoverRating(star)} 
              onMouseLeave={() => setHoverRating(0)} 
              style={{ cursor: 'pointer', fontSize: 30, color: star <= (hoverRating || rating) ? '#fbbf24' : '#cbd5e1' }}
            >
              ★
            </span>
          ))}
        </div>
        <textarea 
          placeholder="Share your experience..." 
          value={comments} 
          onChange={(e) => setComments(e.target.value)} 
          rows="3" 
          className="form-input" 
          style={{ marginBottom: 10, width: '100%' }}
        />
        <button type="submit" disabled={submitting || rating === 0} className="btn btn-primary btn-full">
          {submitting ? 'Submitting...' : '📝 Submit Feedback'}
        </button>
      </form>
      {feedbacks.length > 0 && (
        <div className="recent-feedback" style={{ marginTop: 20 }}>
          <h4>⭐ Recent Reviews</h4>
          {feedbacks.map(fb => (
            <div key={fb.id} style={{ padding: 10, borderBottom: '1px solid #e8f2ff', marginBottom: 8 }}>
              <strong>{fb.patient_name || 'Anonymous'}</strong> gave {'⭐'.repeat(fb.rating)}
              {fb.comments && <p style={{ fontSize: 12, marginTop: 5, color: '#64748b' }}>{fb.comments}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}