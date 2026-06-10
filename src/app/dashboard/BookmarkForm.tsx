'use client'

import { useState, useRef } from 'react'
import { addBookmark } from './actions'

export function BookmarkForm({ userAvatar }: { userAvatar?: string | null }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    const result = await addBookmark(formData)
    
    if (result?.error) {
      setError(result.error)
    } else {
      formRef.current?.reset()
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '1.5rem 0', marginBottom: '2rem' }}>
      <form ref={formRef} action={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        
        {/* Avatar */}
        <div style={{ 
          width: '44px', height: '44px', 
          borderRadius: '50%', 
          background: userAvatar ? `url(${userAvatar}) center/cover` : 'var(--card-border)',
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          {!userAvatar && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          )}
        </div>

        {/* Composer Card */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '16px',
          overflow: 'hidden',
          transition: 'border-color 0.2s ease',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
        className="composer-card"
        >
          
          <input 
            type="url" 
            name="url" 
            placeholder="What's the link?" 
            required
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--foreground)',
              fontSize: '1.15rem',
              outline: 'none',
              width: '100%',
              padding: '1rem 1rem 0.5rem 1rem',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
          />
          
          <div style={{ display: 'flex', padding: '0 1rem' }}>
            <input 
              type="text" 
              name="title" 
              placeholder="Title (e.g. Next.js Guide)" 
              required
              style={{ 
                flex: 1, 
                padding: '0.5rem 0', 
                background: 'transparent',
                border: 'none',
                color: 'var(--foreground)',
                fontSize: '0.95rem',
                outline: 'none',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
            />
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.06)', margin: '0.5rem 1rem' }}></div>
            <input 
              type="text" 
              name="folder" 
              placeholder="Folder/Tag (Optional)" 
              style={{ 
                flex: 1, 
                padding: '0.5rem 0', 
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.95rem',
                outline: 'none',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
            />
          </div>

          <div style={{ padding: '0 1rem' }}>
            <input 
              type="text" 
              name="description" 
              placeholder="Add a note... (Optional)" 
              style={{ 
                width: '100%',
                padding: '0.5rem 0', 
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.95rem',
                outline: 'none',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
            />
          </div>

          {error && <div style={{ padding: '0 1rem', color: 'var(--primary)', fontSize: '0.85rem' }}>{error}</div>}

          {/* Action Bar */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '0.75rem 1rem',
            background: 'rgba(255,255,255,0.01)',
            borderTop: '1px solid rgba(255, 255, 255, 0.04)'
          }}>
            <div className="text-muted" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Saves as private
            </div>
            <button 
              type="submit" 
              className="hover-opacity"
              style={{ 
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                width: 'auto', 
                padding: '0.5rem 1.5rem', 
                borderRadius: '999px', 
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </form>
      <style dangerouslySetInnerHTML={{__html: `
        .composer-card:focus-within {
          border-color: rgba(255, 255, 255, 0.15) !important;
          background: rgba(255, 255, 255, 0.03) !important;
        }
      `}} />
    </div>
  )
}
