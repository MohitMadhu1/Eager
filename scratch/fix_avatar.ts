import { createClient } from '@supabase/supabase-js'
import { loadEnvConfig } from '@next/env'

const projectDir = process.cwd()
loadEnvConfig(projectDir)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixAvatar() {
  const { data, error } = await supabase
    .from('profiles')
    .update({ avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mohitmadhu29&backgroundColor=c0aede' })
    .eq('handle', 'mohitmadhu29')
    
  console.log('Update result:', data, error)
}

fixAvatar()
