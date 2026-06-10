'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

import { getLinkPreview } from 'link-preview-js'

export async function addBookmark(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const url = formData.get('url') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const folder = formData.get('folder') as string

  if (!url || !title) {
    return { error: 'URL and Title are required' }
  }

  // Validate URL format simply
  let cleanUrl = url
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl
  }

  // Fetch OpenGraph image preview
  let ogImageUrl = null;
  try {
    const previewData = await getLinkPreview(cleanUrl, {
      imagesPropertyType: 'og',
      timeout: 3000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EagerMindsBot/1.0; +http://eagerminds.com)'
      }
    });
    if ('images' in previewData && previewData.images && previewData.images.length > 0) {
      ogImageUrl = previewData.images[0];
    }
  } catch (err) {
    console.error("Failed to fetch link preview for", cleanUrl);
  }

  const { error } = await supabase
    .from('bookmarks')
    .insert([{
      user_id: user.id,
      url: cleanUrl,
      title,
      description: description || null,
      folder: folder ? folder.trim() : null,
      is_public: false, // Default to private
      og_image_url: ogImageUrl
    }])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/explore')
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
  const folder = formData.get('folder') as string

  if (!title) {
    return { error: 'Title is required' }
  }

  const { error } = await supabase
    .from('bookmarks')
    .update({ 
      title, 
      description: description || null,
      folder: folder ? folder.trim() : null
    })
    .eq('id', id)
    .eq('user_id', user.id) // Ensure they own it

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function toggleLike(bookmarkId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Check if like exists
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('bookmark_id', bookmarkId)
    .maybeSingle()

  if (existingLike) {
    // Delete it
    await supabase.from('likes').delete().eq('id', existingLike.id)
  } else {
    // Insert it
    await supabase.from('likes').insert([{ user_id: user.id, bookmark_id: bookmarkId }])
  }

  revalidatePath('/dashboard')
  revalidatePath('/explore')
  return { success: true }
}
