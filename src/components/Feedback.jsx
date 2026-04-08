import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Feedback() {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comments, setComments] = useState('')
  const [patientName, setPatientName] = useState('')
  const [tokenId, setTokenId] = useState('')
  const [feedbacks, setFeedbacks] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const ratingEmojis = ['😞', '😐', '🙂', '😊', '🤩']
  const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

  useEffect(() => {
    loadFeedbacks()
  }, [])

  const loadFeedbacks = async () => {
    const { data } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    if (data) setFeedbacks(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) return
    setSubmitting(true)

    const { error } = await supabase.from('feedback').insert({
      patient_name: patientName || 'Anonymous',
      token: tokenId || null,
      rating,
      comments
    })

    if (!error) {
      setSubmitted(true)
      setRating(0)
      setComments('')
      setPatientName('')
      setTokenId('')
      loadFeedbacks()
      setTimeout(() => setSubmitted(false), 3000)
    }
    setSubmitting(false)
  }

  return (
    <div className="feedback-sidebar">
      <div className="feedback-header">
        <h3>💬 Patient Feedback</h3>
      </div>

      {submitted && (
        <div className="feedback-success">
          ✅ Thank you for your feedback! 💙
        </div>
      )}

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label>Your Name (Optional)</label>
          <input
            type="text"
            className="form-input"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Anonymous"
          />
        </div>

        <div className="form-group">
          <label>Token Number (Optional)</label>
          <input
            type="text"
            className="form-input"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="e.g., 101"
          />
        </div>

        <div className="form-group">
          <label>Rate your experience</label>
          <div className="feedback-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <span className="star-emoji">{ratingEmojis[star - 1]}</span>
                <span className="star-icon">★</span>
              </button>
            ))}
          </div>
          {(hoverRating || rating) > 0 && (
            <div className="rating-label">
              {ratingLabels[(hoverRating || rating) - 1]}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Your Comments</label>
          <textarea
            className="form-input"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Share your experience with us..."
            rows="3"
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full" disabled={submitting || rating === 0}>
          {submitting ? 'Submitting...' : '📝 Submit Feedback'}
        </button>
      </form>

      {feedbacks.length > 0 && (
        <div className="recent-feedback">
          <h4>⭐ Recent Reviews</h4>
          {feedbacks.map((fb) => (
            <div key={fb.id} className="feedback-item">
              <div className="feedback-item-header">
                <span className="feedback-name">{fb.patient_name || 'Anonymous'}</span>
                <span className="feedback-rating">
                  {Array.from({ length: fb.rating }, (_, i) => '⭐').join('')}
                </span>
              </div>
              {fb.comments && <p className="feedback-comment">{fb.comments}</p>}
              <span className="feedback-date">
                {new Date(fb.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}