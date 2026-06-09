import Link from 'next/link'

export default function CheckEmailPage() {
  return (
    <div className="auth-container">
      <div className="glass-card text-center">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
        <h1 className="mb-2" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
          Check your email
        </h1>
        <p className="text-muted mb-6" style={{ fontSize: '1rem', lineHeight: 1.5 }}>
          We've sent a confirmation link to your email address. Please click the link to verify your account.
        </p>
        <Link href="/login" className="btn-outline">
          Return to Login
        </Link>
      </div>
    </div>
  )
}
