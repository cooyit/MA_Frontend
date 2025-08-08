// src/components/eslesme/EslesmeTreeTable.tsx
"use client";
import type { ReactElement } from "react";
import {
  ChevronRight, ChevronDown, Folder, FolderOpen, Target, BarChart3, TrendingUp,
} from "lucide-react";
import { useState } from "react";

import { EslesmeOptionsMenu } from "./EslesmeOptionsMenu";
import { StatPill } from "@/components/common/StatPill";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ToggleAllButtonGroup } from "@/components/common/ToggleAllButtonGroup";

/* ---------- Tipler (discriminated union) ---------- */
type Aktif = 0 | 1 | 2;

interface BaseItem {
  id: string;
  name: string;
  aktif: Aktif;
}

export interface Gosterge extends BaseItem {
  type: "gosterge";
}

export interface Kriter extends BaseItem {
  type: "kriter";
  gostergeSayisi?: number;
  gostergeler: Gosterge[];
  /** bazı flatten senaryolarında sanal kriter satırı */
  _virtual?: boolean;
}

export interface Boyut extends BaseItem {
  type: "boyut";
  kriterSayisi?: number;
  gostergeSayisi?: number;
  kriterler?: Kriter[];
  gostergeler?: Gosterge[];
}

export interface Model extends BaseItem {
  type: "model";
  boyutlar: Boyut[];
  hiyerarsi?: boolean;
  boyutSayisi?: number;
  kriterSayisi?: number;
  gostergeSayisi?: number;
}

type TreeItem = Model | Boyut | Kriter | Gosterge;

/* ---------- Model sayaçları pill ---------- */
function ModelCountsPill({ m }: { m: Model }) {
  const b = m.boyutSayisi ?? (m.boyutlar?.length ?? 0);

  const k =
    m.kriterSayisi ??
    (m.boyutlar?.reduce(
      (sum, b) => sum + (b.kriterSayisi ?? b.kriterler?.length ?? 0),
      0
    ) ?? 0);

  const g =
    m.gostergeSayisi ??
    (m.boyutlar?.reduce((sum, b) => {
      const fromBoyut = b.gostergeSayisi ?? b.gostergeler?.length ?? 0;
      const fromKriter =
        b.kriterler?.reduce(
          (s2, k) => s2 + (k.gostergeler?.length ?? 0),
          0
        ) ?? 0;
      return sum + fromBoyut + fromKriter;
    }, 0) ?? 0);

  const parts = [`B: ${b}`];
  if (k > 0) parts.push(`K: ${k}`);
  parts.push(`G: ${g}`);

  return (
    <span className="hidden md:flex mr-2">
      <StatPill tone="neutral" size="xs">
        {parts.join(" ")}
      </StatPill>
    </span>
  );
}

/* ---------- Sağ hücreler ---------- */
function StatusCell({ value }: { value: Aktif }) {
  return (
    <span className="hidden md:flex w-[56px] justify-center">
      <StatusBadge value={value} className="scale-90 origin-center" />
    </span>
  );
}

function MenuCell({
  item,
  onAction,
}: {
  item: TreeItem;
  onAction?: (a: string) => void;
}) {
  return (
    <span className="hidden md:flex w-[28px] justify-center">
      <EslesmeOptionsMenu item={item} onAction={(a) => onAction?.(a)} />
    </span>
  );
}

/* ---------- Ana tablo ---------- */
interface EslesmeTreeTableProps {
  data: Model[];
  onItemClick?: (item: TreeItem, action: string) => void;
}

export function EslesmeTreeTable({ data, onItemClick }: EslesmeTreeTableProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getIcon = (type: TreeItem["type"], isExpanded: boolean) => {
    switch (type) {
      case "model":
        return isExpanded ? (
          <FolderOpen className="h-4 w-4 text-blue-400" />
        ) : (
          <Folder className="h-4 w-4 text-blue-400" />
        );
      case "boyut":
        return <BarChart3 className="h-4 w-4 text-green-400" />;
      case "kriter":
        return <Target className="h-4 w-4 text-orange-400" />;
      case "gosterge":
        return <TrendingUp className="h-4 w-4 text-purple-400" />;
      default:
        return null;
    }
  };

  const handleExpandAll = () => {
    const all = new Set<string>();
    const walk = (models: Model[]) => {
      const addBoyut = (b: Boyut) => {
        all.add(b.id);
        b.kriterler?.forEach(addKriter);
        b.gostergeler?.forEach((g) => all.add(g.id));
      };
      const addKriter = (k: Kriter) => {
        all.add(k.id);
        k.gostergeler.forEach((g) => all.add(g.id));
      };
      models.forEach((m) => {
        all.add(m.id);
        m.boyutlar?.forEach(addBoyut);
      });
    };
    walk(data);
    setExpandedItems(all);
  };

  const handleCollapseAll = () => setExpandedItems(new Set());

  const renderTreeItem = (item: TreeItem, level = 0): ReactElement => {
    const isExpanded = expandedItems.has(item.id);

    // sanal kriter satırı çizilmez; sadece alt göstergeleri dola
    if (item.type === "kriter" && (item._virtual || !item.name)) {
      return (
        <div key={item.id}>
          {item.gostergeler?.map((g) => renderTreeItem(g, level + 1))}
        </div>
      );
    }

    const hasChildren =
      (item.type === "model" && item.boyutlar?.length > 0) ||
      (item.type === "boyut" &&
        ((item.kriterler?.length ?? 0) > 0 ||
          (item.gostergeler?.length ?? 0) > 0)) ||
      (item.type === "kriter" && (item.gostergeler?.length ?? 0) > 0);

    return (
      <div key={item.id}>
        <div
          className="flex items-center py-2 px-4 hover:bg-accent border-b border-border"
          style={{ paddingLeft: `${16 + level * 24}px` }}
        >
          {/* sol: expand + ikon + ad */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {hasChildren ? (
              <button
                onClick={() => toggleExpanded(item.id)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={isExpanded ? "Daralt" : "Genişlet"}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            ) : (
              <div className="w-4" />
            )}

            {getIcon(item.type, isExpanded)}

            <span className="text-foreground font-medium truncate">
              {item.name}
            </span>
          </div>

          {/* sağ: (yalnız modelde) b/k/g pill + durum + menü */}
          {item.type === "model" && <ModelCountsPill m={item} />}
          <StatusCell value={item.aktif} />
          <MenuCell item={item} onAction={(a) => onItemClick?.(item, a)} />
        </div>

        {isExpanded && (
          <div>
            {item.type === "model" &&
              item.boyutlar?.map((b) => renderTreeItem(b, level + 1))}
            {item.type === "boyut" && (
              <>
                {item.kriterler?.map((k) => renderTreeItem(k, level + 1))}
                {item.gostergeler?.map((g) => renderTreeItem(g, level + 1))}
              </>
            )}
            {item.type === "kriter" &&
              item.gostergeler?.map((g) => renderTreeItem(g, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <ToggleAllButtonGroup
          onCollapseAll={handleCollapseAll}
          onExpandAll={handleExpandAll}
        />
        <StatPill tone="info">{data.length} model bulundu</StatPill>
      </div>

      {/* Legend – sadece tür ikonları */}
      <div className="bg-muted px-4 py-3 border-b border-border">
        <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
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
      <div className="max-h-96 overflow-y-auto">
        {data.map((model) => renderTreeItem(model, 0))}
      </div>
    </div>
  );
}
