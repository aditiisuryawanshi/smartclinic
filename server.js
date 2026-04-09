const express = require('express')
const { Pool } = require('pg')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'MediQueue API is running!' })
})

app.get('/api/queue', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM queue_entries WHERE status = 'waiting' ORDER BY created_at ASC"
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/checkin', async (req, res) => {
  const { name, dept, phone, symptoms, priority, age } = req.body
  
  try {
    const tokenResult = await pool.query(
      "SELECT value FROM app_metadata WHERE key = 'next_token'"
    )
    const tokenNumber = parseInt(tokenResult.rows[0]?.value || '101')
    const nextToken = tokenNumber + 1
    
    await pool.query(
      "UPDATE app_metadata SET value = $1 WHERE key = 'next_token'",
      [String(nextToken)]
    )
    
    const countResult = await pool.query(
      "SELECT COUNT(*) FROM queue_entries WHERE status = 'waiting'"
    )
    const position = parseInt(countResult.rows[0].count) + 1
    const waitTime = position * 8
    
    const result = await pool.query(
      `INSERT INTO queue_entries (token, name, dept, phone, symptoms, priority, status, position, wait, age, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'waiting', $7, $8, $9, NOW())
       RETURNING *`,
      [String(tokenNumber), name, dept, phone || '', symptoms || [], priority || 'low', position, waitTime, age || null]
    )
    
    res.json({ success: true, patient: result.rows[0], token: tokenNumber, position, wait: waitTime })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/call-next', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM queue_entries 
       WHERE status = 'waiting' 
       ORDER BY 
         CASE priority 
           WHEN 'high' THEN 1 
           WHEN 'medium' THEN 2 
           WHEN 'low' THEN 3 
         END, 
         created_at ASC 
       LIMIT 1`
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No patients waiting' })
    }
    
    const next = result.rows[0]
    
    await pool.query(
      "UPDATE queue_entries SET status = 'calling', called_at = NOW() WHERE id = $1",
      [next.id]
    )
    
    res.json({ success: true, patient: next })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.patch('/api/serve/:id', async (req, res) => {
  const { id } = req.params
  
  try {
    await pool.query(
      "UPDATE queue_entries SET status = 'served', served_at = NOW() WHERE id = $1",
      [id]
    )
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/feedback', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM feedback ORDER BY created_at DESC LIMIT 10"
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/feedback', async (req, res) => {
  const { patient_name, token, rating, comments } = req.body
  
  try {
    await pool.query(
      `INSERT INTO feedback (patient_name, token, rating, comments, created_at) 
       VALUES ($1, $2, $3, $4, NOW())`,
      [patient_name || 'Anonymous', token || null, rating, comments || '']
    )
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)
})