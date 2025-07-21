"use client"

import type React from "react"
import { ChevronRight } from "lucide-react"

interface MenuItem {
  label: string
  count: number
  onClick?: () => void
}

interface MenuListProps {
  items: MenuItem[]
}

export const MenuList: React.FC<MenuListProps> = ({ items }) => {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => {
        const isClickable = typeof item.onClick === "function"

        return (
            <li
            key={index}
            onClick={item.onClick}
            className={`
              group flex items-center justify-between px-4 py-2 rounded-md
              ${isClickable ? "hover:bg-blue-950 dark:hover:bg-blue-900 cursor-pointer" : "cursor-default"}
              transition
            `}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-white">
                {item.label}
              </span>
              {isClickable && (
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
              )}
            </div>
            <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-2 py-1 rounded-full">
              {item.count}
            </span>
          </li>
          
        )
      })}
    </ul>
  )
}
