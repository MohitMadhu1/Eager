import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { OnboardingForm } from './OnboardingForm'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if they already have a profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (profile) {
    redirect('/dashboard')
  }

  return (
    <div className="auth-container">
      <div className="glass-card">
        <h1 className="serif text-center mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>
          Claim your handle
        </h1>
        <p className="text-center text-muted mb-6">
          This will be your public URL where people can see your bookmarks.
        </p>

        <OnboardingForm userId={user.id} />
      </div>
    </div>
  )
}
