const express = require('express')
const { createClient } = require('@supabase/supabase-js')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'MediQueue API running with Supabase!' })
})

// Get all waiting patients
app.get('/api/queue', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('queue_entries')
      .select('*')
      .eq('status', 'waiting')
      .order('created_at', { ascending: true })
    
    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get next token
app.get('/api/next-token', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('app_metadata')
      .select('value')
      .eq('key', 'next_token')
      .single()
    
    if (error) throw error
    res.json({ token: parseInt(data?.value || '101') })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Check-in patient
app.post('/api/checkin', async (req, res) => {
  const { name, dept, phone, symptoms, priority, age } = req.body
  
  try {
    // Get next token
    const { data: tokenData, error: tokenError } = await supabase
      .from('app_metadata')
      .select('value')
      .eq('key', 'next_token')
      .single()
    
    if (tokenError) throw tokenError
    
    const currentToken = parseInt(tokenData?.value || '101')
    const nextToken = currentToken + 1
    
    await supabase
      .from('app_metadata')
      .update({ value: String(nextToken) })
      .eq('key', 'next_token')
    
    // Get position
    const { count, error: countError } = await supabase
      .from('queue_entries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'waiting')
    
    if (countError) throw countError
    
    const position = (count || 0) + 1
    const waitTime = position * 8
    
    // Insert patient
    const { data, error } = await supabase
      .from('queue_entries')
      .insert([{
        token: String(currentToken),
        name,
        dept,
        phone: phone || '',
        symptoms: symptoms || [],
        priority: priority || 'low',
        status: 'waiting',
        position,
        wait: waitTime,
        age: age || null,
        created_at: new Date().toISOString()
      }])
      .select()
    
    if (error) throw error
    
    res.json({ 
      success: true, 
      patient: data[0], 
      token: currentToken, 
      position, 
      wait: waitTime 
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Call next patient
app.post('/api/call-next', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('queue_entries')
      .select('*')
      .eq('status', 'waiting')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(1)
    
    if (error) throw error
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No patients waiting' })
    }
    
    const next = data[0]
    
    await supabase
      .from('queue_entries')
      .update({ status: 'calling', called_at: new Date().toISOString() })
      .eq('id', next.id)
    
    res.json({ success: true, patient: next })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Serve patient
app.patch('/api/serve/:id', async (req, res) => {
  const { id } = req.params
  
  try {
    await supabase
      .from('queue_entries')
      .update({ status: 'served', served_at: new Date().toISOString() })
      .eq('id', id)
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

