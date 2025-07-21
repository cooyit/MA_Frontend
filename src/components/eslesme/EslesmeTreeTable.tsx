// components/eslesme/EslesmeTreeTable.tsx
import { ChevronRight, ChevronDown, Folder, FolderOpen, Target, BarChart3, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EslesmeOptionsMenu } from "./EslesmeOptionsMenu"
import { useState } from "react"


interface Gosterge {
  id: string
  name: string
  durum: string
  type: "gosterge"
}

interface Kriter {
  id: string
  name: string
  durum: string
  type: "kriter"
  gostergeler: Gosterge[]
}

interface Boyut {
  id: string
  name: string
  durum: string
  type: "boyut"
  kriterler: Kriter[]
}

export interface Model {
  id: string
  name: string
  durum: string
  type: "model"
  boyutlar: Boyut[]
}

interface EslesmeTreeTableProps {
  data: Model[]
  onItemClick?: (item: any, action: string) => void
}

export function EslesmeTreeTable({ data, onItemClick }: EslesmeTreeTableProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const getIcon = (type: string, isExpanded: boolean) => {
    switch (type) {
      case "model":
        return isExpanded ? (
          <FolderOpen className="h-4 w-4 text-blue-400" />
        ) : (
          <Folder className="h-4 w-4 text-blue-400" />
        )
      case "boyut":
        return <BarChart3 className="h-4 w-4 text-green-400" />
      case "kriter":
        return <Target className="h-4 w-4 text-orange-400" />
      case "gosterge":
        return <TrendingUp className="h-4 w-4 text-purple-400" />
      default:
        return null
    }
  }

  const handleExpandAll = () => {
    const allIds = new Set<string>()
    const collectIds = (items: any[]) => {
      items.forEach((item) => {
        allIds.add(item.id)
        if (item.boyutlar) collectIds(item.boyutlar)
        if (item.kriterler) collectIds(item.kriterler)
        if (item.gostergeler) collectIds(item.gostergeler)
      })
    }
    collectIds(data)
    setExpandedItems(allIds)
  }

  const handleCollapseAll = () => {
    setExpandedItems(new Set())
  }

  const renderTreeItem = (item: any, level = 0) => {
    const isExpanded = expandedItems.has(item.id)
    const hasChildren =
      (item.type === "model" && item.boyutlar?.length > 0) ||
      (item.type === "boyut" && item.kriterler?.length > 0) ||
      (item.type === "kriter" && item.gostergeler?.length > 0)

    return (
      <div key={item.id}>
        <div
          className="flex items-center py-3 px-4 hover:bg-slate-700/50 border-b border-slate-700"
          style={{ paddingLeft: `${16 + level * 24}px` }}
        >
          <div className="flex items-center flex-1 gap-3">
            {hasChildren && (
              <button
                onClick={() => toggleExpanded(item.id)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            )}
            {!hasChildren && <div className="w-4" />}

            {getIcon(item.type, isExpanded)}

            <span className="text-white font-medium flex-1">{item.name}</span>

            <Badge
              variant={item.durum === "Aktif" ? "default" : "secondary"}
              className={item.durum === "Aktif" ? "bg-emerald-600" : "bg-slate-600"}
            >
              {item.durum}
            </Badge>

            <EslesmeOptionsMenu item={item} onAction={(action) => onItemClick?.(item, action)} />
          </div>
        </div>

        {isExpanded && (
          <div>
            {item.type === "model" && item.boyutlar?.map((boyut: Boyut) => renderTreeItem(boyut, level + 1))}
            {item.type === "boyut" && item.kriterler?.map((kriter: Kriter) => renderTreeItem(kriter, level + 1))}
            {item.type === "kriter" &&
              item.gostergeler?.map((gosterge: Gosterge) => renderTreeItem(gosterge, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-slate-800 border-slate-700 rounded-lg">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            onClick={handleCollapseAll}
          >
            Tümünü Kapat
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            onClick={handleExpandAll}
          >
            Tümünü Aç
          </Button>
        </div>
        <Badge variant="secondary" className="bg-slate-700 text-slate-300">
          {data.length} model bulundu
        </Badge>
      </div>

      {/* Legend */}
      <div className="bg-slate-700 px-4 py-3 border-b border-slate-600">
        <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4 text-blue-400" />
            <span>Model</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-green-400" />
            <span>Boyut</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-orange-400" />
            <span>Kriter</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-400" />
            <span>Gösterge</span>
          </div>
        </div>
      </div>

      {/* Tree Content */}
      <div className="max-h-96 overflow-y-auto">{data.map((model) => renderTreeItem(model, 0))}</div>
    </div>
  )
}
