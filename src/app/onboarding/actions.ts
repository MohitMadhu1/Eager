'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function saveProfile(formData: FormData) {
  const supabase = await createClient()
  
  const userId = formData.get('userId') as string
  const handle = formData.get('handle') as string
  const avatarFile = formData.get('avatar') as File | null

  if (!handle || handle.length < 3) {
    return { error: 'Handle must be at least 3 characters long' }
  }

  // Ensure handle is lowercase alphanumeric + underscores
  const cleanHandle = handle.toLowerCase().replace(/[^a-z0-9_]/g, '')
  
  if (cleanHandle !== handle) {
    return { error: 'Handle can only contain lowercase letters, numbers, and underscores' }
  }

  let finalAvatarUrl = null

  // 1. Upload Avatar if provided
  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    
    const { error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(fileName, avatarFile, {
        cacheControl: '3600',
        upsert: true
      })
      
    if (uploadError) {
      return { error: 'Failed to upload image. Make sure you created the avatars bucket! Error: ' + uploadError.message }
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(fileName)
      
    finalAvatarUrl = publicUrl
  }

  // 2. Insert into profiles table
  const { error } = await supabase
    .from('profiles')
    .insert([
      { id: userId, handle: cleanHandle, avatar_url: finalAvatarUrl }
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
