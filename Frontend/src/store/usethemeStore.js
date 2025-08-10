import { create } from 'zustand'

const usethemeStore = create((set) => ({
  mytheme: "forest", // bydeafult theme coffee
  setTheme: (theme)=> set({theme}) // and if i change the theme it would change
}))

export default usethemeStore