import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { logout } from '@/app/login/actions'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/onboarding')
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 className="serif" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Dashboard
          </h1>
          <p className="text-muted">
            Welcome back, @{profile.handle}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href={`/${profile.handle}`} style={{ color: 'var(--primary)', fontWeight: 500 }}>
            View Public Profile
          </Link>
          <form action={logout}>
            <button className="btn-outline" style={{ padding: '0.5rem 1rem' }} type="submit">
              Log out
            </button>
          </form>
        </div>
      </header>

      <div className="glass-card" style={{ maxWidth: '100%' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Your Bookmarks</h2>
        
        <div style={{ padding: '3rem', textAlign: 'center', border: '1px dashed var(--card-border)', borderRadius: '12px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }}>📌</div>
          <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No bookmarks yet</h3>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Start saving your favorite links here.</p>
          <button className="btn-primary" style={{ width: 'auto' }}>
            + Add Bookmark
          </button>
        </div>
      </div>
    </div>
  )
}
