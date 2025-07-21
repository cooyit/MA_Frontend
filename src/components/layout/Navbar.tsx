import React from "react"
import { Search, Moon, Globe, LucideSettings } from "lucide-react"
import logo from "@/assets/logo.png" // Vite alias'ı kullanıyorsan @ sembolüyle

interface NavbarProps {
  onToggleTheme: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleTheme }) => {
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3">
                <img src={logo} alt="Logo" className="h-8 w-auto" />
                
            </div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Hastane 4.0
            </h1>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-8 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Model, ülke, veya kullanıcı ara..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg"
          >
            <Moon className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg">
            <Globe className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg">
            <LucideSettings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}
