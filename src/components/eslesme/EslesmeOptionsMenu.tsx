// src/components/eslesme/EslesmeOptionsMenu.tsx

"use client"

import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface EslesmeOptionsMenuProps {
  item: {
    id: string
    name: string
    type: string // "model" | "boyut" | "kriter" | "gosterge"
    durum: string
  }
  onAction: (action: string) => void
}

export function EslesmeOptionsMenu({ item, onAction }: EslesmeOptionsMenuProps) {
  const getMenuItems = () => {
    switch (item.type) {
      case "model":
        return [{ label: "Model Detayına Git", action: "model-detail" }]
      case "boyut":
        return [{ label: "Boyut Detayına Git", action: "boyut-detail" }]
      case "kriter":
        return [{ label: "Kriter Detayına Git", action: "kriter-detail" }]
      case "gosterge":
        return [{ label: "Gösterge Detayına Git", action: "gosterge-detail" }]
      default:
        return []
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-700 border-slate-600">
        {getMenuItems().map((menuItem) => (
          <DropdownMenuItem
            key={menuItem.action}
            className="text-white hover:bg-slate-600"
            onClick={() => onAction(menuItem.action)}
          >
            {menuItem.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
