import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ptthgxxiyeykflkmdhcm.supabase.co'
const supabaseAnonKey = 'sb_publishable_qtmeGIyFXlocYtNf2mnusg_9vBI_tlx'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)