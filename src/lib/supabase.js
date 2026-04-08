// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lhizhvohiaehjcmgjojb.supabase.co'
const supabaseAnonKey = 'sb_publishable_kanzSiEkKBLGosGV9LJm1Q__cUHf4d2'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)