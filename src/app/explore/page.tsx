import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { logout } from '@/app/login/actions'
import { toggleLike } from '@/app/dashboard/actions'

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : ''
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : 'newest'
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) || 1 : 1
  
  const limit = 10
  const offset = (page - 1) * limit

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

  // Build the global bookmarks query
  let query = supabase
    .from('bookmarks')
    .select('*, profiles!inner(handle, avatar_url), likes(user_id)', { count: 'exact' })
    .eq('is_public', true)

  if (q) {
    query = query.ilike('title', `%${q}%`)
  }

  if (sort === 'oldest') {
    query = query.order('created_at', { ascending: true })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data: globalBookmarks, count, error } = await query.range(offset, offset + limit - 1)

  if (error) {
    console.error("SUPABASE EXPLORE ERROR:", error)
  }

  const totalPages = count ? Math.ceil(count / limit) : 1

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
            <div style={{ 
              width: '32px', height: '32px', 
              borderRadius: '50%', 
              background: profile.avatar_url ? `url(${profile.avatar_url}) center/cover` : 'var(--primary)',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600
            }}>
              {!profile.avatar_url && profile.handle.charAt(0).toUpperCase()}
            </div>
            <Link href="/dashboard" style={{ fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} className="link-hover">@{profile.handle}</Link>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link href="/dashboard" style={{ fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none' }} className="hover-opacity">
              Home
            </Link>
            <Link href="/explore" style={{ fontWeight: 600, color: 'var(--foreground)', textDecoration: 'none', position: 'relative' }}>
              Explore
              <div style={{ position: 'absolute', bottom: '-12px', left: 0, right: 0, height: '2px', background: 'var(--primary)', borderRadius: '2px' }}></div>
            </Link>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href={`/${profile.handle}`} className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderRadius: '999px', background: 'var(--card-bg)', whiteSpace: 'nowrap' }}>
            Public Profile
          </Link>
          <form action={logout}>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap' }} type="submit" className="hover-opacity">
              Log out
            </button>
          </form>
        </div>
      </nav>

      <main style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem', position: 'relative', zIndex: 1, fontFamily: 'Inter, system-ui, sans-serif' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', margin: 0, fontFamily: 'Inter, system-ui, sans-serif' }}>
            Global Explore
          </h1>

          {/* Search & Sort Filters */}
          <form action="/explore" method="GET" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                name="q" 
                defaultValue={q} 
                placeholder="Search..." 
                style={{
                  padding: '0.5rem 1rem 0.5rem 2.25rem',
                  fontSize: '0.85rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                  outline: 'none',
                  width: '200px',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }}
              />
            </div>
            
            <select 
              name="sort" 
              defaultValue={sort} 
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                color: 'var(--foreground)',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
            >
              <option value="newest" style={{ background: 'var(--background)' }}>Newest First</option>
              <option value="oldest" style={{ background: 'var(--background)' }}>Oldest First</option>
            </select>
            
            <button type="submit" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '8px', cursor: 'pointer' }}>
              Apply
            </button>
            
            {q && (
              <Link href="/explore" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }} className="hover-opacity">
                Clear
              </Link>
            )}
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {!globalBookmarks || globalBookmarks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '16px' }}>
              <p className="text-muted" style={{ fontSize: '1.1rem' }}>No bookmarks found.</p>
              {q && <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Try adjusting your search filters.</p>}
            </div>
          ) : (
            globalBookmarks.map((b) => {
              const likeCount = b.likes ? b.likes.length : 0
              const isLikedByMe = b.likes ? b.likes.some((l: any) => l.user_id === user.id) : false
              const handleLike = toggleLike.bind(null, b.id)
              
              return (
              <div key={b.id} style={{ 
                padding: '1.5rem 0', 
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', 
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {/* Author Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{ 
                    width: '24px', height: '24px', 
                    borderRadius: '50%', 
                    background: b.profiles.avatar_url ? `url(${b.profiles.avatar_url}) center/cover` : 'var(--primary)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 600
                  }}>
                    {!b.profiles.avatar_url && b.profiles.handle.charAt(0).toUpperCase()}
                  </div>
                  <Link href={`/${b.profiles.handle}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }} className="hover-opacity">
                    @{b.profiles.handle}
                  </Link>
                  {b.folder && (
                    <>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>•</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.15rem 0.6rem', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                        {b.folder}
                      </span>
                    </>
                  )}
                </div>

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
            )})
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
            {page > 1 ? (
              <Link href={`/explore?q=${q}&sort=${sort}&page=${page - 1}`} className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '8px', textDecoration: 'none' }}>
                Previous
              </Link>
            ) : (
              <span style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '8px', color: 'var(--text-muted)', opacity: 0.5, cursor: 'not-allowed' }}>Previous</span>
            )}
            
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Page {page} of {totalPages}</span>
            
            {page < totalPages ? (
              <Link href={`/explore?q=${q}&sort=${sort}&page=${page + 1}`} className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '8px', textDecoration: 'none' }}>
                Next
              </Link>
            ) : (
              <span style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '8px', color: 'var(--text-muted)', opacity: 0.5, cursor: 'not-allowed' }}>Next</span>
            )}
          </div>
        )}

      </main>
      <style dangerouslySetInnerHTML={{__html: `
        .hover-opacity:hover { opacity: 0.8; }
        .link-hover:hover { color: var(--foreground) !important; text-decoration: underline !important; }
      `}} />
    </>
  )
}
