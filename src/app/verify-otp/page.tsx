import { redirect } from 'next/navigation'
import { VerifyOtpForm } from './VerifyOtpForm'

export default async function VerifyOtpPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const email = typeof resolvedParams.email === 'string' ? resolvedParams.email : null

  if (!email) {
    redirect('/signup')
  }

  return (
    <div className="auth-container">
      <div className="glass-card">
        <h1 className="text-center mb-2" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
          Check your email
        </h1>
        <p className="text-center text-muted mb-6">
          We sent a 6-digit code to <strong>{email}</strong>
        </p>

        <VerifyOtpForm email={email} />
      </div>
    </div>
  )
}
