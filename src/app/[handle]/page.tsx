import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function PublicProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = await params
  const handle = resolvedParams.handle
  const supabase = await createClient()

  // 1. Find the user by handle
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, handle, avatar_url, created_at')
    .eq('handle', handle)
    .single()

  if (!profile) {
    notFound()
  }

  // 2. Fetch their PUBLIC bookmarks
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_public', true)
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
        <Link href="/" style={{ color: 'var(--foreground)', textDecoration: 'none', fontWeight: 700, fontSize: '1.25rem' }} className="serif">
          EagerMinds
        </Link>
        <Link href="/dashboard" className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', borderRadius: '999px' }}>
          My Dashboard
        </Link>
      </nav>

      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '4rem 1rem', position: 'relative', zIndex: 1 }}>
        
        {/* Profile Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
          <div style={{ 
            width: '96px', height: '96px', 
            borderRadius: '50%', 
            background: profile.avatar_url ? `url(${profile.avatar_url}) center/cover` : 'var(--primary)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px',
            marginBottom: '1rem',
            boxShadow: '0 8px 32px rgba(220, 53, 69, 0.2)'
          }}>
            {!profile.avatar_url && profile.handle.charAt(0).toUpperCase()}
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>@{profile.handle}</h1>
          <p className="text-muted">Joined {new Date(profile.created_at).toLocaleDateString()}</p>
        </div>

        {/* Public Feed */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
          Public Links
        </h2>

        {!bookmarks || bookmarks.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <p className="text-muted">@{profile.handle} hasn't shared any public links yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {bookmarks.map((b) => (
              <div key={b.id} style={{ 
                padding: '1.5rem 0', 
                borderBottom: '1px solid var(--card-border)',
                display: 'flex', 
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                
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

      </main>
    </>
  )
}
