import { create } from 'zustand'

const useThemeStore = create((set) => ({
  mytheme: localStorage.getItem("streamify-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("streamify-theme", theme);
    set({ mytheme: theme });
  }
}))

export default useThemeStore; 