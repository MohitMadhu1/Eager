import { createClient } from '@supabase/supabase-js'
import { loadEnvConfig } from '@next/env'

const projectDir = process.cwd()
loadEnvConfig(projectDir)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function setup() {
  console.log("Creating avatars bucket...")
  const { data, error } = await supabase.storage.createBucket('avatars', {
    public: true,
    fileSizeLimit: 1024 * 1024 * 5, // 5MB
  })
  console.log("Bucket creation:", data, error)
  
  // Set bucket to public
  const { data: updateData, error: updateError } = await supabase.storage.updateBucket('avatars', {
    public: true,
  })
  console.log("Bucket update:", updateData, updateError)
}

setup()
