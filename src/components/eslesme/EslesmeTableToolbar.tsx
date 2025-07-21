// components/eslesme/EslesmeTableToolbar.tsx
"use client"

import { Filter, RefreshCw} from "lucide-react"
import { Button } from "@/components/ui/button"

interface EslesmeTableToolbarProps {
  onFilter?: () => void
  onRefresh?: () => void

}

export function EslesmeTableToolbar({ onFilter, onRefresh }: EslesmeTableToolbarProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          onClick={onFilter}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtrele
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Yenile
        </Button>
      </div>
      
    </div>
  )
}

