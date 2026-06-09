'use client'

import { useState } from 'react'
import { verifySignupOtp } from '@/app/login/actions'

export function VerifyOtpForm({ email }: { email: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    formData.append('email', email)
    
    const result = await verifySignupOtp(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit}>
      <div className="form-group mb-6">
        <label className="form-label" htmlFor="otp">6-Digit Code</label>
        <input 
          className="form-input text-center" 
          id="otp" 
          name="otp" 
          type="text" 
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="000000"
          style={{ letterSpacing: '0.5em', fontSize: '1.5rem', fontWeight: 600 }}
          required 
          autoFocus
        />
      </div>

      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? 'Verifying...' : 'Verify Email'}
      </button>

      {error && <div className="form-error">{error}</div>}
    </form>
  )
}
