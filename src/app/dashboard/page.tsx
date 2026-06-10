import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { logout } from '@/app/login/actions'
import { BookmarkForm } from './BookmarkForm'
import { BookmarkList } from './BookmarkList'
import { SearchInput } from '@/components/SearchInput'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : ''
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

  // State for rendering
  let personalBookmarks: any[] = []
  let searchUsers: any[] = []
  let searchBookmarks: any[] = []

  if (q) {
    // DO SEARCH
    const { data: userData } = await supabase
      .from('profiles')
      .select('id, handle, avatar_url')
      .ilike('handle', `%${q}%`)
      .limit(5)
    if (userData) searchUsers = userData

    const { data: bookmarkData } = await supabase
      .from('bookmarks')
      .select('*, profiles(handle, avatar_url)')
      .eq('is_public', true)
      .ilike('title', `%${q}%`)
      .order('created_at', { ascending: false })
      .limit(20)
    if (bookmarkData) searchBookmarks = bookmarkData
  } else {
    // DO NORMAL DASHBOARD
    const { data: bookmarks } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (bookmarks) personalBookmarks = bookmarks
  }

  return (
    <>
      <div className="bg-grid"></div>
      
      {/* Top Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--card-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/dashboard" style={{ fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} className="link-hover">@{profile.handle}</Link>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link href="/dashboard" style={{ fontWeight: 600, color: 'var(--foreground)', textDecoration: 'none', position: 'relative' }}>
              Home
              <div style={{ position: 'absolute', bottom: '-12px', left: 0, right: 0, height: '2px', background: 'var(--primary)', borderRadius: '2px' }}></div>
            </Link>
            <Link href="/explore" style={{ fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none' }} className="hover-opacity">
              Explore
            </Link>
          </div>

          {/* Search Bar directly in Nav */}
          <div style={{ maxWidth: '400px', width: '100%', display: 'flex', alignItems: 'center' }}>
            <SearchInput 
              initialValue={q} 
              placeholder="Search EagerMinds..." 
              style={{
                width: '100%',
                borderRadius: '999px',
                fontSize: '0.9rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--card-border)'
              }}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href={`/${profile.handle}`} className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', borderRadius: '999px', background: 'var(--card-bg)', whiteSpace: 'nowrap' }}>
            Public Profile
          </Link>
          <form action={logout}>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.875rem', whiteSpace: 'nowrap' }} type="submit" className="hover-opacity">
              Log out
            </button>
          </form>
        </div>
      </nav>

      <main style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem', position: 'relative', zIndex: 1 }}>
        
        {q ? (
          /* SEARCH RESULTS VIEW */
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>
              Search results for "{q}"
            </h1>

            {/* Users Results */}
            {searchUsers.length > 0 && (
              <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>People</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {searchUsers.map(u => (
                    <Link key={u.id} href={`/${u.handle}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', textDecoration: 'none', color: 'var(--foreground)' }} className="hover-opacity">
                      <div style={{ 
                        width: '40px', height: '40px', 
                        borderRadius: '50%', 
                        background: u.avatar_url ? `url(${u.avatar_url}) center/cover` : 'var(--primary)',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px'
                      }}>
                        {!u.avatar_url && u.handle.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>@{u.handle}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Bookmarks Results */}
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Public Links</h2>
              
              {searchBookmarks.length === 0 ? (
                <p className="text-muted">No public links found matching "{q}".</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {searchBookmarks.map((b) => (
                    <div key={b.id} style={{ 
                      padding: '1.5rem 0', 
                      borderBottom: '1px solid var(--card-border)',
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                         <div style={{ 
                            width: '20px', height: '20px', 
                            borderRadius: '50%', 
                            background: b.profiles.avatar_url ? `url(${b.profiles.avatar_url}) center/cover` : 'var(--primary)',
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px'
                          }}>
                            {!b.profiles.avatar_url && b.profiles.handle.charAt(0).toUpperCase()}
                          </div>
                          <Link href={`/${b.profiles.handle}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }} className="hover-opacity">
                            @{b.profiles.handle}
                          </Link>
                      </div>

                      <h3 style={{ fontWeight: 600, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>
                        <a href={b.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--foreground)', textDecoration: 'none' }} className="hover-opacity">
                          {b.title}
                        </a>
                      </h3>
                      
                      {b.description && (
                        <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: 1.4 }}>
                          {b.description}
                        </p>
                      )}

                      <a href={b.url} target="_blank" rel="noopener noreferrer" style={{ 
                        color: 'var(--primary)', 
                        fontSize: '0.9rem', 
                        textDecoration: 'none', 
                        display: 'inline-block',
                        marginTop: '0.25rem',
                        wordBreak: 'break-all'
                      }}>
                        {b.url}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {searchUsers.length === 0 && searchBookmarks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No results found</h3>
                <p className="text-muted">Try searching for a different term.</p>
              </div>
            )}
          </div>
        ) : (
          /* NORMAL DASHBOARD VIEW */
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 350px', position: 'sticky', top: '100px' }}>
              <BookmarkForm userAvatar={profile.avatar_url} />
            </div>
            <div style={{ flex: '2 1 500px' }}>
              <BookmarkList bookmarks={personalBookmarks} />
            </div>
          </div>
        )}

      </main>
    </>
  )
}
