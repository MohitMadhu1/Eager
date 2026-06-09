import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      {/* Background decorations matching BillBhai */}
      <div className="bg-grid"></div>
      <div className="bg-glow"></div>
      <div className="bg-glow-amber"></div>

      <main style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        
        <div style={{ maxWidth: '800px', width: '100%' }}>
          
          <div style={{
            display: 'inline-block',
            padding: '0.25rem 1rem',
            background: 'rgba(220, 53, 69, 0.1)',
            border: '1px solid rgba(220, 53, 69, 0.2)',
            borderRadius: '999px',
            color: 'var(--primary)',
            fontSize: '0.875rem',
            fontWeight: 500,
            marginBottom: '2rem'
          }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', marginRight: '8px', boxShadow: '0 0 8px var(--primary)' }}></span>
            The personal bookmarks app
          </div>

          <h1 className="serif" style={{ 
            fontSize: 'clamp(3rem, 8vw, 5.5rem)', 
            fontWeight: 800, 
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em'
          }}>
            Bookmarks Made<br />
            <span className="gradient-text">Effortless.</span>
          </h1>
          
          <p className="text-muted" style={{ 
            fontSize: '1.125rem', 
            marginBottom: '3rem', 
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto 3rem auto'
          }}>
            EagerMinds is the all-in-one platform for saving links privately and sharing your public profile - designed for speed, built for you.
          </p>

          {user ? (
            <Link href="/dashboard" className="btn-primary" style={{ width: 'auto', padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              Go to Dashboard
            </Link>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/signup" className="btn-primary" style={{ width: 'auto', padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                Start Free Trial &rarr;
              </Link>
              <Link href="/login" className="btn-outline" style={{ width: 'auto', padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                Log in
              </Link>
            </div>
          )}

          <hr style={{ margin: '4rem auto', borderColor: 'var(--card-border)', opacity: 0.5, maxWidth: '400px' }} />

          <div style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
            <h2 className="serif" style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>Find a user</h2>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search for @handle..." 
                style={{ 
                  padding: '1rem 1rem 1rem 3rem', 
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  fontSize: '1.125rem'
                }}
              />
              <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                @
              </span>
            </div>
          </div>
        </div>

      </main>
    </>
  )
}
