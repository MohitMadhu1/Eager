'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function addBookmark(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const url = formData.get('url') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string

  if (!url || !title) {
    return { error: 'URL and Title are required' }
  }

  // Validate URL format simply
  let cleanUrl = url
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl
  }

  const { error } = await supabase
    .from('bookmarks')
    .insert([{
      user_id: user.id,
      url: cleanUrl,
      title,
      description: description || null,
      is_public: false // Default to private
    }])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteBookmark(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // Ensure they own it

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function toggleBookmarkVisibility(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('bookmarks')
    .update({ is_public: !currentStatus })
    .eq('id', id)
    .eq('user_id', user.id) // Ensure they own it

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  // We should also revalidate the public profile page, but we haven't built it yet.
  return { success: true }
}

export async function editBookmark(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const title = formData.get('title') as string
  const description = formData.get('description') as string

  if (!title) {
    return { error: 'Title is required' }
  }

  const { error } = await supabase
    .from('bookmarks')
    .update({ title, description: description || null })
    .eq('id', id)
    .eq('user_id', user.id) // Ensure they own it

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
