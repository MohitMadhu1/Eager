'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Check if they have a profile setup
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()
      
    if (!profile) {
      redirect('/onboarding')
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  // We are using Supabase Auth to create the user, but we will send
  // the welcome/confirmation email via Resend instead of Supabase's built-in 
  // email to meet the assignment requirements. 
  // NOTE: For this to work smoothly without Supabase overriding it, 
  // "Enable Email Confirmations" should be OFF in Supabase if we completely replace it, 
  // OR we keep it on and use Supabase's confirmation link.
  // The assignment asks us to wire up Resend. 
  // Let's use standard Supabase signup, and then trigger a Resend email 
  // via an edge function or directly here if Resend is used for the welcome.
  
  // For safety and assignment compliance, we'll sign them up and send a welcome email via Resend.
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // If successful, send welcome email via Resend
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    await resend.emails.send({
      from: 'EagerMinds <onboarding@resend.dev>', // Resend sandbox domain
      to: email,
      subject: 'Welcome to EagerMinds Bookmarks!',
      html: '<p>Thanks for signing up! Please return to the app and set up your @handle.</p>'
    })
  } catch (emailError) {
    console.error("Failed to send welcome email via Resend:", emailError)
    // We don't fail the signup if the email fails, just log it.
  }

  // Redirect to a page telling them to check their email (or straight to onboarding if confirmation is off)
  // For the sake of the UX flow we agreed on, we'll send them to onboarding directly
  // since they are logged in automatically by Supabase if email confirmation is disabled in settings.
  revalidatePath('/', 'layout')
  redirect('/onboarding')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
