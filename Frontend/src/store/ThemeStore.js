import { create } from 'zustand'

const ThemeStore = create((set) => ({
  mytheme: localStorage.getItem("streamify-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("streamify-theme", theme);
    set({ mytheme: theme });
  }
}))

export default ThemeStore; 