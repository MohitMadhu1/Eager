'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export function SearchInput({ 
  initialValue = '', 
  placeholder = "Search...", 
  style = {} 
}: { 
  initialValue?: string
  placeholder?: string
  style?: React.CSSProperties
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(initialValue)

  // Sync value if URL changes from outside (e.g. clicking 'Clear')
  useEffect(() => {
    setValue(searchParams.get('q') || '')
  }, [searchParams])

  useEffect(() => {
    // Only push if value differs from current query param to avoid infinite loops
    const currentQ = searchParams.get('q') || ''
    if (value === currentQ) return

    const timer = setTimeout(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))
      
      if (value) {
        current.set('q', value)
      } else {
        current.delete('q')
      }
      
      // Reset to page 1 on new search
      if (current.has('page')) {
        current.delete('page')
      }

      const search = current.toString()
      const query = search ? `?${search}` : ''
      
      router.push(`${pathname}${query}`)
    }, 300)

    return () => clearTimeout(timer)
  }, [value, pathname, router, searchParams])

  return (
    <div style={{ position: 'relative', width: style.width || 'auto', flex: style.flex || 'none' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input 
        type="text" 
        name="q"
        value={value} 
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder} 
        style={{
          padding: '0.5rem 1rem 0.5rem 2.25rem',
          fontSize: '0.85rem',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          color: 'var(--foreground)',
          outline: 'none',
          fontFamily: 'Inter, system-ui, sans-serif',
          ...style
        }}
      />
    </div>
  )
}
