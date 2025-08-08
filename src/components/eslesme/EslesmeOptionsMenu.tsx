// src/components/eslesme/EslesmeOptionsMenu.tsx
/** @file Ağaç satırı için “daha fazla” menüsü; tipe göre uygun detay aksiyonunu sunar. */

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
    type: "model" | "boyut" | "kriter" | "gosterge" // daha dar union
    durum?: string                                  // not: şu an bileşende kullanılmıyor
  }
  onAction: (action: string) => void
}

export function EslesmeOptionsMenu({ item, onAction }: EslesmeOptionsMenuProps) {
  const getMenuItems = () => {
    switch (item.type) {
      case "model":    return [{ label: "Model Detayına Git",    action: "model-detail" }]
      case "boyut":    return [{ label: "Boyut Detayına Git",    action: "boyut-detail" }]
      case "kriter":   return [{ label: "Kriter Detayına Git",   action: "kriter-detail" }]
      case "gosterge": return [{ label: "Gösterge Detayına Git", action: "gosterge-detail" }]
      default:         return []
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          aria-label="Seçenekler"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-popover text-popover-foreground border border-border transition-colors">
        {getMenuItems().map((menuItem) => (
          <DropdownMenuItem
            key={menuItem.action}
            className="hover:bg-accent hover:text-accent-foreground"
            onClick={() => onAction(menuItem.action)}
          >
            {menuItem.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
