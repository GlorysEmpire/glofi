'use client'

/**
 * Side-effect import initializes i18next once for the whole app tree.
 * Swap this provider later for full multi-language UI without touching pages.
 */
import '@/i18n'

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
