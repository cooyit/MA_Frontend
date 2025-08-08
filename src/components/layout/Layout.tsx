// src/components/layout/Layout.tsx
import React from "react"
import { Navbar } from "./Navbar"

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}
