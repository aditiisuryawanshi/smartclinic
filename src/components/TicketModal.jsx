import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

export default function TicketModal({ data, onClose }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (data && canvasRef.current) {
      const qrData = JSON.stringify({
        token: data.token,
        name: data.name,
        department: data.dept,
        date: new Date().toISOString()
      })
      QRCode.toCanvas(canvasRef.current, qrData, {
        width: 180,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      })
    }
  }, [data])

  if (!data) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Your Token: #{data.token}</h3>
        <canvas ref={canvasRef}></canvas>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}