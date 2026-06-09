'use client'

import { useState } from 'react'
import { login } from './actions'
import Link from 'next/link'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="glass-card">
        <h1 className="text-center mb-2" style={{ fontSize: '1.75rem', fontWeight: 700 }}>Welcome Back</h1>
        <p className="text-center text-muted mb-6">Log in to manage your bookmarks</p>

        <form action={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input 
              className="form-input" 
              id="email" 
              name="email" 
              type="email" 
              placeholder="you@example.com"
              required 
            />
          </div>
          
          <div className="form-group mb-6">
            <label className="form-label" htmlFor="password">Password</label>
            <input 
              className="form-input" 
              id="password" 
              name="password" 
              type="password" 
              placeholder="••••••••"
              required 
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>

          {error && <div className="form-error">{error}</div>}
        </form>

        <p className="text-center mt-6 text-muted" style={{ fontSize: '0.875rem' }}>
          Don't have an account? <Link href="/signup" className="link">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
