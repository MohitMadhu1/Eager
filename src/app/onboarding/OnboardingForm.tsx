'use client'

import { useState } from 'react'
import { saveProfile } from './actions'

export function OnboardingForm({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // We will build the live availability check in the next step
  // For now, let's just make it submit to the Server Action

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
    <form action={handleSubmit}>
      <div className="form-group mb-6">
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
          />
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            @
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          eagerminds.com/<span style={{ color: 'var(--foreground)' }}>yourhandle</span>
        </p>
      </div>

      <div className="form-group mb-6">
        <label className="form-label" htmlFor="avatar">Profile Picture URL (Optional)</label>
        <input 
          className="form-input" 
          id="avatar" 
          name="avatar" 
          type="url" 
          placeholder="https://example.com/avatar.jpg"
        />
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Paste an image URL. We'll set up file uploads shortly.
        </p>
      </div>

      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Complete Setup'}
      </button>

      {error && <div className="form-error">{error}</div>}
    </form>
  )
}
