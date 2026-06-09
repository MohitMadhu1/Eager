import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { logout } from '@/app/login/actions'
import { BookmarkForm } from './BookmarkForm'
import { BookmarkList } from './BookmarkList'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch the user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/onboarding')
  }

  // Fetch their bookmarks
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <>
      <div className="bg-grid"></div>
      
      {/* Top Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--card-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '32px', height: '32px', 
            borderRadius: '50%', 
            background: profile.avatar_url ? `url(${profile.avatar_url}) center/cover` : 'var(--primary)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px'
          }}>
            {!profile.avatar_url && profile.handle.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: 600 }}>@{profile.handle}</span>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href={`/${profile.handle}`} className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', borderRadius: '999px', background: 'var(--card-bg)' }}>
            Share Profile
          </Link>
          <form action={logout}>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.875rem' }} type="submit">
              Log out
            </button>
          </form>
        </div>
      </nav>

      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem 1rem', position: 'relative', zIndex: 1 }}>
        {/* Composer */}
        <BookmarkForm userAvatar={profile.avatar_url} />

        {/* Spacer */}
        <div style={{ height: '1rem', background: 'var(--background)' }}></div>

        {/* Feed */}
        <div style={{ borderTop: '1px solid var(--card-border)' }}>
          <BookmarkList bookmarks={bookmarks || []} />
        </div>
      </main>
    </>
  )
}
