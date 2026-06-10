import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import Beams from '@/components/Beams'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Beams 
          beamWidth={3}
          beamHeight={20}
          beamNumber={40}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
        />
      </div>
      
      {/* Navigation Bar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2rem',
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 10,
        background: 'transparent',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#fff' }}>
          EagerMinds
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <Link href="/dashboard" className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, padding: '0.5rem 1rem', whiteSpace: 'nowrap', textDecoration: 'none' }} className="hover-opacity">
                Log in
              </Link>
              <Link href="/signup" className="btn-primary" style={{ padding: '0.5rem 1.25rem', background: '#fff', color: '#000', border: 'none' }}>
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
        padding: '2rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        
        <div style={{ maxWidth: '800px', width: '100%' }}>
          
          <h1 style={{ 
            fontSize: 'clamp(3rem, 8vw, 6rem)', 
            fontWeight: 800, 
            lineHeight: 1.1,
            marginBottom: '3rem',
            letterSpacing: '-0.04em',
            color: '#fff',
            textShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}>
            Curate the web.
          </h1>
          
          {!user && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/signup" className="hover-opacity" style={{ 
                background: '#fff', 
                color: '#000', 
                padding: '1.25rem 2.5rem', 
                fontSize: '1.15rem',
                fontWeight: 600,
                borderRadius: '999px',
                textDecoration: 'none',
                boxShadow: '0 8px 30px rgba(255,255,255,0.2)'
              }}>
                Claim your @handle
              </Link>
            </div>
          )}
        </div>

      </main>
    </>
  )
}
