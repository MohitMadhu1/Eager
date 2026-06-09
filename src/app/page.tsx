import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <div className="bg-grid"></div>
      <div className="bg-glow"></div>
      
      {/* Navigation Bar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2rem',
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 10,
        background: 'linear-gradient(to bottom, rgba(10, 10, 15, 0.9), transparent)',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
          <span className="gradient-text">Eager</span>Minds
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <Link href="/dashboard" className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" style={{ color: 'var(--foreground)', fontWeight: 500, padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}>
                Log in
              </Link>
              <Link href="/signup" className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        padding: '6rem 2rem 2rem 2rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        
        <div style={{ maxWidth: '700px', width: '100%' }}>
          
          <div style={{
            display: 'inline-block',
            padding: '0.35rem 1rem',
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '999px',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            fontWeight: 500,
            marginBottom: '2rem'
          }}>
            Welcome to the Take-Home Task
          </div>

          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
            fontWeight: 800, 
            lineHeight: 1.15,
            marginBottom: '1.5rem',
            letterSpacing: '-0.03em'
          }}>
            Your personal corner <br />
            of the <span className="gradient-text">internet.</span>
          </h1>
          
          <p className="text-muted" style={{ 
            fontSize: '1.25rem', 
            marginBottom: '3rem', 
            lineHeight: 1.6,
            maxWidth: '550px',
            margin: '0 auto 3rem auto'
          }}>
            Save your favorite links privately, or claim a unique handle to share your curated collections with the world.
          </p>

          {!user && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/signup" className="btn-primary" style={{ width: 'auto', padding: '1rem 2rem', fontSize: '1.125rem' }}>
                Claim your @handle
              </Link>
            </div>
          )}
        </div>

      </main>
    </>
  )
}
