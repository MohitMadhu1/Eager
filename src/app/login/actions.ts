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

  // 1. Create the user in Supabase (logs them in instantly since Confirm Email is OFF)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  const userId = authData.user?.id
  if (!userId) {
    return { error: 'Failed to create user' }
  }

  // 2. Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  // 3. Store OTP in database
  const { error: dbError } = await supabase
    .from('custom_otps')
    .upsert([{ user_id: userId, otp }])

  if (dbError) {
    return { error: 'Failed to generate verification code.' }
  }

  // 4. Send email via Resend
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    await resend.emails.send({
      from: 'EagerMinds <onboarding@resend.dev>', // Resend sandbox domain
      to: email,
      subject: 'Your EagerMinds Verification Code',
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 2rem;">
          <h1>Welcome to EagerMinds!</h1>
          <p>Your 6-digit verification code is:</p>
          <h2 style="font-size: 2.5rem; letter-spacing: 0.2em; color: #dc3545; background: #f8f9fa; display: inline-block; padding: 1rem; border-radius: 8px;">${otp}</h2>
          <p>Return to the app and enter this code to complete your setup.</p>
        </div>
      `
    })
  } catch (emailError) {
    console.error("Failed to send OTP email via Resend:", emailError)
  }

  // 5. Redirect to verify OTP
  redirect(`/verify-otp?email=${encodeURIComponent(email)}`)
}

export async function verifySignupOtp(formData: FormData) {
  const supabase = await createClient()
  
  // We don't actually need the email because the user is already logged in (Confirm Email = OFF).
  // We can just get their user ID from their active session!
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Session expired. Please log in again.' }
  }

  const token = formData.get('otp') as string

  if (!token || token.length !== 6) {
    return { error: 'Please enter a valid 6-digit code' }
  }

  // Verify OTP against the database
  const { data: otpData, error: dbError } = await supabase
    .from('custom_otps')
    .select('otp')
    .eq('user_id', user.id)
    .single()

  if (dbError || !otpData) {
    return { error: 'No verification code found. Please request a new one.' }
  }

  if (otpData.otp !== token) {
    return { error: 'Incorrect code. Please try again.' }
  }

  // OTP Matches! Delete it so they are verified.
  await supabase
    .from('custom_otps')
    .delete()
    .eq('user_id', user.id)

  revalidatePath('/', 'layout')
  redirect('/onboarding')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
