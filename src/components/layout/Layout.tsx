import React, { useEffect, useState } from "react"
import { Navbar } from "./Navbar"

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  // localStorage'dan tema al
  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null
    if (stored) setTheme(stored)
  }, [])

  // tema değişince <html> elementine class ekle/çıkar
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))} />
      <main>{children}</main>
    </div>
  )
}
