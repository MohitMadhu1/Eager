import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { toggleLike } from '@/app/dashboard/actions'

export default async function PublicProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = await params
  const handle = resolvedParams.handle
  const supabase = await createClient()

  // Get currently logged in user (if any)
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Find the user by handle
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, handle, avatar_url, created_at')
    .eq('handle', handle)
    .single()

  if (!profile) {
    notFound()
  }

  // 2. Fetch their PUBLIC bookmarks with likes
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*, likes(user_id)')
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
        padding: '0.75rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--card-border)',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/" style={{ fontWeight: 700, color: 'var(--foreground)', textDecoration: 'none', letterSpacing: '-0.03em', fontSize: '1.25rem' }}>
              EagerMinds
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {user && (
              <Link href="/dashboard" style={{ fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none' }} className="hover-opacity">
                Home
              </Link>
            )}
            <Link href="/explore" style={{ fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none' }} className="hover-opacity">
              Explore
            </Link>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <Link href={`/dashboard`} className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderRadius: '999px', background: 'var(--card-bg)', whiteSpace: 'nowrap' }}>
              My Dashboard
            </Link>
          ) : (
            <Link href="/login" className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderRadius: '999px', whiteSpace: 'nowrap' }}>
              Sign in
            </Link>
          )}
        </div>
      </nav>

      <main style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', position: 'relative', zIndex: 1, fontFamily: 'Inter, system-ui, sans-serif' }}>
        
        {/* Profile Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
          <div style={{ 
            width: '96px', height: '96px', 
            borderRadius: '50%', 
            background: 'var(--primary)',
            color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 600,
            marginBottom: '1rem',
            border: '2px solid rgba(255,255,255,0.05)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              profile.handle.charAt(0).toUpperCase()
            )}
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '-0.03em', fontFamily: 'Inter, system-ui, sans-serif' }}>@{profile.handle}</h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>Joined {new Date(profile.created_at).toLocaleDateString()}</p>
        </div>

        {/* Spacer */}
        <div style={{ height: '1rem', background: 'var(--background)' }}></div>

        {/* Public Feed */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem' }}>

          {!bookmarks || bookmarks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '16px' }}>
              <p className="text-muted" style={{ fontSize: '1.1rem' }}>@{profile.handle} hasn't shared any public links yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {bookmarks.map((b) => {
                const likeCount = b.likes ? b.likes.length : 0
                const isLikedByMe = user && b.likes ? b.likes.some((l: any) => l.user_id === user.id) : false
                const handleLike = toggleLike.bind(null, b.id) as unknown as () => void
                
                return (
                <div key={b.id} style={{ 
                  padding: '1.5rem 0', 
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  
                  {b.folder && (
                    <div style={{ marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.15rem 0.6rem', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                        {b.folder}
                      </span>
                    </div>
                  )}

                  <h3 style={{ fontWeight: 600, fontSize: '1.15rem', letterSpacing: '-0.02em', wordBreak: 'break-word', color: 'var(--foreground)', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    <a href={b.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} className="hover-opacity">
                      {b.title}
                    </a>
                  </h3>
                  
                  {b.description && (
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--text-muted)', wordBreak: 'break-word', marginTop: '0.25rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
                      {b.description}
                    </p>
                  )}

                  {b.og_image_url && (
                    <a href={b.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', marginTop: '0.75rem', marginBottom: '0.25rem' }} className="hover-opacity">
                      <img 
                        src={b.og_image_url} 
                        alt={b.title} 
                        style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }} 
                      />
                    </a>
                  )}

                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
                    
                    {/* LIKE BUTTON */}
                    {user ? (
                      <form action={handleLike}>
                        <button type="submit" className="hover-opacity" style={{ 
                          background: isLikedByMe ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                          border: `1px solid ${isLikedByMe ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.1)'}`,
                          color: isLikedByMe ? '#ef4444' : 'var(--text-muted)',
                          borderRadius: '999px',
                          padding: '0.3rem 0.75rem',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          transition: 'all 0.2s'
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill={isLikedByMe ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                          {likeCount}
                        </button>
                      </form>
                    ) : (
                      <Link href="/login" className="hover-opacity" style={{ 
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--text-muted)',
                        borderRadius: '999px',
                        padding: '0.3rem 0.75rem',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        transition: 'all 0.2s'
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        {likeCount}
                      </Link>
                    )}

                    <a href={b.url} target="_blank" rel="noopener noreferrer" className="link-hover" style={{ 
                      color: 'var(--text-muted)', 
                      fontSize: '0.85rem', 
                      textDecoration: 'none', 
                      wordBreak: 'break-all',
                      transition: 'color 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontFamily: 'Inter, system-ui, sans-serif'
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                      {b.url.replace(/^https?:\/\//i, '')}
                    </a>
                  </div>

                </div>
              )})}
            </div>
          )}
        </div>
      </main>
      <style dangerouslySetInnerHTML={{__html: `
        .hover-opacity:hover { opacity: 0.8; }
        .link-hover:hover { color: var(--foreground) !important; text-decoration: underline !important; }
      `}} />
    </>
  )
}
