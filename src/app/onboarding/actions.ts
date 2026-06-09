'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function saveProfile(formData: FormData) {
  const supabase = await createClient()
  
  const userId = formData.get('userId') as string
  const handle = formData.get('handle') as string
  const avatarUrl = formData.get('avatar') as string | null

  if (!handle || handle.length < 3) {
    return { error: 'Handle must be at least 3 characters long' }
  }

  // Ensure handle is lowercase alphanumeric + underscores
  const cleanHandle = handle.toLowerCase().replace(/[^a-z0-9_]/g, '')
  
  if (cleanHandle !== handle) {
    return { error: 'Handle can only contain lowercase letters, numbers, and underscores' }
  }

  // Insert into profiles table
  const { error } = await supabase
    .from('profiles')
    .insert([
      { id: userId, handle: cleanHandle, avatar_url: avatarUrl || null }
    ])

  if (error) {
    // PostgREST error 23505 is a unique violation (handle already taken)
    if (error.code === '23505') {
      return { error: 'That handle is already taken! Please choose another.' }
    }
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
