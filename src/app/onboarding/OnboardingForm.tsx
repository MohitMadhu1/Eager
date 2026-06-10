'use client'

import { useState, useRef } from 'react'
import { saveProfile } from './actions'

export function OnboardingForm({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Real-time handle state
  const [handle, setHandle] = useState('')
  
  // Real-time avatar preview state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      // Create a local object URL for instant preview
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    }
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    formData.append('userId', userId)
    
    const result = await saveProfile(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. Profile Picture Upload */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div 
          onClick={() => fileInputRef.current?.click()}
          style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            background: previewUrl ? `url(${previewUrl}) center/cover` : 'var(--card-bg)',
            border: '2px dashed var(--card-border)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: 'var(--text-muted)',
            overflow: 'hidden',
            boxShadow: previewUrl ? '0 8px 32px rgba(220, 53, 69, 0.15)' : 'none'
          }}
          className="hover-opacity"
          title="Click to upload profile picture"
        >
          {!previewUrl && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span style={{ fontSize: '0.75rem' }}>Upload</span>
            </div>
          )}
        </div>
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          name="avatar" 
          accept="image/*" 
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        <div style={{ textAlign: 'center' }}>
          <label className="form-label">Profile Picture (Optional)</label>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Click the circle to upload.
          </p>
        </div>
      </div>

      {/* 2. Choose Handle */}
      <div className="form-group">
        <label className="form-label" htmlFor="handle">Choose your handle</label>
        <div style={{ position: 'relative' }}>
          <input 
            className="form-input" 
            id="handle" 
            name="handle" 
            type="text" 
            placeholder="mohit"
            style={{ paddingLeft: '2.5rem' }}
            pattern="[a-zA-Z0-9_]{3,30}"
            title="3-30 characters, letters, numbers, and underscores only"
            required 
            value={handle}
            onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
          />
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            @
          </span>
        </div>
        {/* Dynamic Handle Preview */}
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem', padding: '0.5rem', background: 'var(--card-bg)', borderRadius: '6px', border: '1px solid var(--card-border)' }}>
          Your public URL will be: <br/>
          <span style={{ color: 'var(--primary)', fontWeight: 500 }}>
            eagerminds.com/<span style={{ color: 'var(--foreground)' }}>{handle || 'yourhandle'}</span>
          </span>
        </p>
      </div>

      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Complete Setup'}
      </button>

      {error && <div className="form-error">{error}</div>}
    </form>
  )
}
