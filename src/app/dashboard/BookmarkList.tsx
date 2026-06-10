'use client'

import { useState } from 'react'
import { deleteBookmark, toggleBookmarkVisibility, editBookmark } from './actions'

type Bookmark = {
  id: string
  url: string
  title: string
  description: string | null
  folder: string | null
  is_public: boolean
  created_at: string
  og_image_url?: string | null
}

export function BookmarkList({ bookmarks }: { bookmarks: Bookmark[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [activeFolder, setActiveFolder] = useState<string | null>(null)

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
      <div style={{ padding: '4rem 2rem', textAlign: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.25rem' }}>Your feed is empty</h3>
        <p className="text-muted">Start saving your favorite links above.</p>
      </div>
    )
  }

  // Extract unique folders
  const folders = Array.from(new Set(bookmarks.map(b => b.folder).filter(Boolean))) as string[]

  const filteredBookmarks = activeFolder 
    ? bookmarks.filter(b => b.folder === activeFolder)
    : bookmarks

  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* File Explorer Navigation */}
      {folders.length > 0 && (
        <div style={{ 
          display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1.5rem', 
          borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.5rem',
          scrollbarWidth: 'none'
        }}>
          <button 
            onClick={() => setActiveFolder(null)}
            className="hover-opacity"
            style={{
              background: activeFolder === null ? '#fff' : 'rgba(255,255,255,0.03)',
              color: activeFolder === null ? '#000' : 'var(--text-muted)',
              border: `1px solid ${activeFolder === null ? '#fff' : 'rgba(255,255,255,0.08)'}`,
              padding: '0.4rem 1.25rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap'
            }}
          >
            All Bookmarks
          </button>
          
          {folders.map(folder => (
            <button 
              key={folder}
              onClick={() => setActiveFolder(folder)}
              className="hover-opacity"
              style={{
                background: activeFolder === folder ? '#fff' : 'rgba(255,255,255,0.03)',
                color: activeFolder === folder ? '#000' : 'var(--text-muted)',
                border: `1px solid ${activeFolder === folder ? '#fff' : 'rgba(255,255,255,0.08)'}`,
                padding: '0.4rem 1.25rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: '0.35rem'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              {folder}
            </button>
          ))}
        </div>
      )}

      {filteredBookmarks.length === 0 ? (
        <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          This folder is empty.
        </div>
      ) : (
        filteredBookmarks.map((b) => (
          <div key={b.id} style={{ 
            padding: '1.5rem 0', 
            borderBottom: '1px solid rgba(255,255,255,0.06)',
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
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.5rem', borderRadius: '8px' }}
                  />
                  <input 
                    type="text" 
                    name="description" 
                    defaultValue={b.description || ''} 
                    placeholder="Add a note... (Optional)"
                    className="form-input"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.5rem', borderRadius: '8px' }}
                  />
                  <input 
                    type="text" 
                    name="folder" 
                    defaultValue={b.folder || ''} 
                    placeholder="Folder/Tag (Optional)"
                    className="form-input"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.5rem', borderRadius: '8px' }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button type="submit" disabled={loadingId === b.id} className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', width: 'auto', borderRadius: '999px' }}>
                      {loadingId === b.id ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderRadius: '999px' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ flex: 1, marginRight: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <h3 style={{ fontWeight: 600, fontSize: '1.15rem', letterSpacing: '-0.02em', wordBreak: 'break-word', color: 'var(--foreground)', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {b.title}
                  </h3>
                  {b.folder && activeFolder === null && (
                    <span 
                      onClick={() => setActiveFolder(b.folder)}
                      className="hover-opacity"
                      style={{ 
                        fontSize: '0.7rem', 
                        color: 'var(--text-muted)', 
                        background: 'rgba(255,255,255,0.04)', 
                        border: '1px solid rgba(255,255,255,0.08)', 
                        padding: '0.15rem 0.6rem', 
                        borderRadius: '999px', 
                        alignSelf: 'flex-start', 
                        fontWeight: 500, 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                      </svg>
                      {b.folder}
                    </span>
                  )}
                </div>
              )}
              
              <button 
                onClick={() => handleToggle(b.id, b.is_public)}
                disabled={loadingId === b.id}
                className="hover-opacity"
                style={{ 
                  background: b.is_public ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                  border: `1px solid ${b.is_public ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255,255,255,0.1)'}`,
                  color: b.is_public ? 'var(--success)' : 'var(--text-muted)',
                  borderRadius: '999px',
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
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
              <p style={{ fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--text-muted)', wordBreak: 'break-word', marginTop: '0.25rem' }}>
                {b.description}
              </p>
            )}

            {b.og_image_url && editingId !== b.id && (
              <a href={b.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', marginTop: '0.75rem', marginBottom: '0.25rem' }} className="hover-opacity">
                <img 
                  src={b.og_image_url} 
                  alt={b.title} 
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }} 
                />
              </a>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <a href={b.url} target="_blank" rel="noopener noreferrer" className="link-hover" style={{ 
                color: 'var(--text-muted)', 
                fontSize: '0.85rem', 
                textDecoration: 'none', 
                wordBreak: 'break-all',
                transition: 'color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                {b.url.replace(/^https?:\/\//i, '')}
              </a>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button 
                  onClick={() => setEditingId(b.id)}
                  disabled={loadingId === b.id}
                  className="hover-opacity"
                  style={{ 
                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button 
                  onClick={() => handleDelete(b.id)}
                  disabled={loadingId === b.id}
                  className="hover-opacity"
                  style={{ 
                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>

          </div>
        ))
      )}
      <style dangerouslySetInnerHTML={{__html: `
        .hover-opacity:hover { opacity: 0.8; }
        .hover-opacity:disabled { opacity: 0.3 !important; cursor: not-allowed !important; }
        .link-hover:hover { color: var(--foreground) !important; text-decoration: underline !important; }
      `}} />
    </div>
  )
}
