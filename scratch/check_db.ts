import { createClient } from '@supabase/supabase-js'
import { loadEnvConfig } from '@next/env'

const projectDir = process.cwd()
loadEnvConfig(projectDir)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkProfiles() {
  const { data, error } = await supabase.from('profiles').select('*')
  console.log('Profiles:', data)
  console.log('Error:', error)
  
  const { data: buckets } = await supabase.storage.listBuckets()
  console.log('Buckets:', buckets)
}

checkProfiles()
