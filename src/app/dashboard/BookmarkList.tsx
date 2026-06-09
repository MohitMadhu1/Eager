'use client'

import { useState } from 'react'
import { deleteBookmark, toggleBookmarkVisibility, editBookmark } from './actions'

type Bookmark = {
  id: string
  url: string
  title: string
  description: string | null
  is_public: boolean
  created_at: string
}

export function BookmarkList({ bookmarks }: { bookmarks: Bookmark[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  async function handleToggle(id: string, currentStatus: boolean) {
    setLoadingId(id)
    await toggleBookmarkVisibility(id, currentStatus)
    setLoadingId(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this bookmark?')) return
    setLoadingId(id)
    await deleteBookmark(id)
    setLoadingId(null)
  }

  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault()
    setLoadingId(id)
    const formData = new FormData(e.currentTarget)
    await editBookmark(id, formData)
    setEditingId(null)
    setLoadingId(null)
  }

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.25rem' }}>Your feed is empty</h3>
        <p className="text-muted">Start saving your favorite links above.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {bookmarks.map((b) => (
        <div key={b.id} style={{ 
          padding: '1.5rem 0', 
          borderBottom: '1px solid var(--card-border)',
          display: 'flex', 
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {/* Conditional Rendering: Edit Mode vs View Mode */}
            {editingId === b.id ? (
              <form onSubmit={(e) => handleEditSubmit(e, b.id)} style={{ flex: 1, marginRight: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={b.title} 
                  required
                  className="form-input"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', padding: '0.5rem' }}
                />
                <input 
                  type="text" 
                  name="description" 
                  defaultValue={b.description || ''} 
                  placeholder="Add a note... (Optional)"
                  className="form-input"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', padding: '0.5rem' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button type="submit" disabled={loadingId === b.id} className="btn-primary" style={{ padding: '0.3rem 1rem', fontSize: '0.85rem', width: 'auto' }}>
                    {loadingId === b.id ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" onClick={() => setEditingId(null)} className="btn-outline" style={{ padding: '0.3rem 1rem', fontSize: '0.85rem' }}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <h3 style={{ fontWeight: 600, fontSize: '1.1rem', letterSpacing: '-0.01em', wordBreak: 'break-word', flex: 1, marginRight: '1rem' }}>
                {b.title}
              </h3>
            )}
            
            <button 
              onClick={() => handleToggle(b.id, b.is_public)}
              disabled={loadingId === b.id}
              className="hover-opacity"
              style={{ 
                background: b.is_public ? 'rgba(34, 197, 94, 0.1)' : 'var(--card-bg)',
                border: `1px solid ${b.is_public ? 'rgba(34, 197, 94, 0.3)' : 'var(--card-border)'}`,
                color: b.is_public ? 'var(--success)' : 'var(--foreground)',
                borderRadius: '999px',
                padding: '0.3rem 0.75rem',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              title={b.is_public ? "Click to make Private" : "Click to make Public"}
            >
              {b.is_public ? (
                <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> Public</>
              ) : (
                <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Private</>
              )}
            </button>
          </div>
          
          {b.description && editingId !== b.id && (
            <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: 1.4, wordBreak: 'break-word' }}>
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
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
            <button 
              onClick={() => setEditingId(b.id)}
              disabled={loadingId === b.id}
              className="hover-opacity"
              style={{ 
                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Edit
            </button>
            <button 
              onClick={() => handleDelete(b.id)}
              disabled={loadingId === b.id}
              className="hover-opacity"
              style={{ 
                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Delete
            </button>
          </div>

        </div>
      ))}
      <style dangerouslySetInnerHTML={{__html: `
        .hover-opacity:hover { opacity: 0.7; }
        .hover-opacity:disabled { opacity: 0.3 !important; cursor: not-allowed !important; }
      `}} />
    </div>
  )
}
