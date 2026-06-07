import { create } from 'zustand'

const saved = localStorage.getItem('theme') || 'warm'
if (saved === 'dark') document.documentElement.classList.add('dark')

const useThemeStore = create((set) => ({
  theme: saved,

  toggle: () =>
    set((s) => {
      const next = s.theme === 'warm' ? 'dark' : 'warm'
      localStorage.setItem('theme', next)
      if (next === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return { theme: next }
    }),
}))

export default useThemeStore
