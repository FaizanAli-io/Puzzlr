import { useTheme } from '@/utils/useTheme'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  const isDark = theme === 'dark'

  return (
    <button
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      onClick={toggleTheme}
      className="fixed top-4 right-4 flex h-6 w-11 items-center rounded-full border border-neutral-300 p-0.5 dark:border-neutral-700"
    >
      <span
        className={`size-4.5 rounded-full bg-neutral-900 transition-transform dark:bg-neutral-100 ${isDark ? 'translate-x-5' : ''}`}
      />
    </button>
  )
}
