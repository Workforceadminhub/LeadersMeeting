import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY

if (!supabaseUrl) {
  throw new Error(
    'Missing Supabase URL. Please set REACT_APP_SUPABASE_URL in your .env file. ' +
    'See .env.example for reference.'
  )
}

if (!supabaseKey) {
  throw new Error(
    'Missing Supabase key. Please set REACT_APP_SUPABASE_KEY in your .env file. ' +
    'See .env.example for reference.'
  )
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase