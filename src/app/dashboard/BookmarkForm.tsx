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
    <div style={{ padding: '1rem 0', marginBottom: '1rem' }}>
      <form ref={formRef} action={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        
        {/* Avatar */}
        <div style={{ 
          width: '40px', height: '40px', 
          borderRadius: '50%', 
          background: userAvatar ? `url(${userAvatar}) center/cover` : 'var(--card-border)',
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)',
          marginTop: '0.25rem'
        }}>
          {!userAvatar && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          
          <input 
            type="url" 
            name="url" 
            placeholder="What's the link?" 
            required
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--foreground)',
              fontSize: '1.25rem',
              outline: 'none',
              width: '100%',
              padding: '0.5rem 0'
            }}
          />
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              name="title" 
              placeholder="Title (e.g. Next.js Guide)" 
              required
              style={{ 
                flex: 1, 
                minWidth: '200px',
                padding: '0.5rem 0', 
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--card-border)',
                color: 'var(--foreground)',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
            <input 
              type="text" 
              name="description" 
              placeholder="Add a note... (Optional)" 
              style={{ 
                flex: 2, 
                minWidth: '200px',
                padding: '0.5rem 0', 
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--card-border)',
                color: 'var(--foreground)',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          {error && <div className="form-error" style={{ marginTop: '0.5rem' }}>{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <div className="text-muted" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Saves as private
            </div>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: 'auto', padding: '0.5rem 1.25rem', borderRadius: '999px', fontSize: '0.95rem' }}
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
