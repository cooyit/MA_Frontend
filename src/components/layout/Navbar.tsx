import React from "react"
import { Search, Globe, LucideSettings } from "lucide-react"
import logo from "@/assets/logo.png"
import ThemeToggle from "@/components/ThemeToggle"

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-background border-b border-border px-6 py-4 transition-colors">
      <div className="flex items-center justify-between">
        {/* Logo & title */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          <h1 className="text-xl font-semibold">Hastane 4.0</h1>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Model, ülke, veya kullanıcı ara..."
              className="w-full pl-10 pr-4 py-2 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg">
            <Globe className="w-5 h-5" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg">
            <LucideSettings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}
