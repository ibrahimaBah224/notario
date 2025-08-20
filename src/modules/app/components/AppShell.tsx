import type { PropsWithChildren } from 'react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AppShell({ children }: PropsWithChildren) {
  const { pathname } = useLocation()
  return (
    <div className="h-full grid grid-cols-[auto_1fr] grid-rows-[64px_1fr]" style={{ gridTemplateAreas: `'sidebar header' 'sidebar main'` }}>
      <Sidebar />
      <header className="[grid-area:header] border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur flex items-center justify-between px-4">
        <div className="font-semibold">{pathname}</div>
        <div className="text-xs text-[var(--muted)]">Demo</div>
      </header>
      <main className="[grid-area:main] overflow-auto">
        <div className="container-safe py-6">
          {children}
        </div>
      </main>
    </div>
  )
}


