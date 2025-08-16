//src/components/kriter/KriterTable.tsx

"use client";

import * as React from "react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Eye, Edit, Power, Plus, Trash2, MoreHorizontal, Languages, ChevronDown, ChevronRight, ArrowUpDown } from "lucide-react";
import { FilterChips, type Chip } from "@/components/common/FilterChips";
import type { StatusNum } from "@/lib/status";

export type KriterTranslation = {
  id: number;
  language: string;
  name: string;
  shortName: string;
  status: StatusNum | "Aktif" | "Taslak" | "Pasif";
  date?: string;
};

export type KriterRow = {
  id: string | number;
  name: string;
  shortName: string;
  language: string;
  status: StatusNum | "Aktif" | "Taslak" | "Pasif";
  date?: string;
  translations?: KriterTranslation[];
};

type Actions = {
  onView: (row: KriterRow) => void;
  onEdit: (row: KriterRow) => void;
  onDelete: (row: KriterRow) => void;
  onActivate: (row: KriterRow) => void;
  onTranslate: (row: KriterRow) => void;

  onTransView?: (parent: KriterRow, t: KriterTranslation) => void;
  onTransEdit?: (parent: KriterRow, t: KriterTranslation) => void;
  onTransActivate?: (parent: KriterRow, t: KriterTranslation) => void;
  onTransDelete?: (parent: KriterRow, t: KriterTranslation) => void;

  onSelectTranslation?: (parent: KriterRow, t: KriterTranslation) => void;
  onSelectLanguage?: (parent: KriterRow, language: string) => void;
};

type Props = {
  rows: KriterRow[];
  loading?: boolean;
  onRowSelect?: (row: KriterRow) => void;
  selectedRowKey?: string;
  actions: Actions;
};

export default function KriterTable({ rows, loading, onRowSelect, selectedRowKey, actions }: Props) {
  const [expandedKeys, setExpandedKeys] = React.useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = React.useState<string>("default");

  // DD.MM.YYYY formatındaki tarihi parse et
  const parseTurkishDate = (dateStr: string): number => {
    if (!dateStr) return 0;
    
    // DD.MM.YYYY formatını kontrol et
    const match = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (match) {
      const [, day, month, year] = match;
      // JavaScript'te ay 0-based olduğu için -1 yapıyoruz
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getTime();
    }
    
    // Eğer farklı format ise normal Date.parse dene
    const parsed = new Date(dateStr).getTime();
    return isNaN(parsed) ? 0 : parsed;
  };

  // Sıralama etiketini al
  const getSortLabel = (sortType: string) => {
    switch (sortType) {
      case "name-asc": return "İsme göre (A → Z)";
      case "name-desc": return "İsme göre (Z → A)";
      case "date-asc": return "Tarihe göre (En eski → En yeni)";
      case "date-desc": return "Tarihe göre (En yeni → En eski)";
      default: return "Varsayılan";
    }
  };

  // Sıralama fonksiyonu
  const sortedRows = React.useMemo(() => {
    if (sortBy === "default") return rows;
    
    const sorted = [...rows];
    switch (sortBy) {
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
      case "date-asc":
        return sorted.sort((a, b) => {
          const dateA = parseTurkishDate(a.date || '');
          const dateB = parseTurkishDate(b.date || '');
          return dateA - dateB;
        });
      case "date-desc":
        return sorted.sort((a, b) => {
          const dateA = parseTurkishDate(a.date || '');
          const dateB = parseTurkishDate(b.date || '');
          return dateB - dateA;
        });
      default:
        return rows;
    }
  }, [rows, sortBy]);

  const expandableRows = sortedRows.filter(r => (r.translations?.length ?? 0) > 0);
  const allExpanded = expandableRows.length > 0 && expandedKeys.size === expandableRows.length;

  const expandAll = () => {
    const keys = expandableRows.map(r => `root-${r.id}`);
    setExpandedKeys(new Set(keys));
  };

  const collapseAll = () => {
    setExpandedKeys(new Set());
  };

  const toggleExpanded = (key: string) => {
    const next = new Set(expandedKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setExpandedKeys(next);
  };

  // Loading state
  if (loading) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2" aria-label="Yükleniyor" role="status" />
        <p className="mt-2 text-muted-foreground">Yükleniyor...</p>
      </div>
    );
  }

  // Empty state
  if (!rows || rows.length === 0) {
    return (
      <div className="rounded-lg border bg-card shadow-sm p-8 text-center">
        <p className="text-muted-foreground">Kayıt bulunamadı</p>
      </div>
    );
  }

  // Sıralama chip'i
  const sortChip: Chip | null = sortBy !== "default" ? {
    id: `sort:${sortBy}`,
    label: `Sıralama: ${getSortLabel(sortBy)}`,
    onRemove: () => setSortBy("default")
  } : null;

  return (
    <div className="space-y-2">
      {/* Sıralama Chip'i */}
      {sortChip && (
        <FilterChips chips={[sortChip]} />
      )}
      
      <div className="flex justify-between items-center">
        {expandableRows.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={allExpanded ? collapseAll : expandAll}
            >
              {allExpanded ? "Tümünü Kapat" : "Tümünü Aç"}
            </Button>
          </div>
        )}
        
        {/* Sıralama Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sıralama
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setSortBy("default")}>
              Varsayılan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy("name-asc")}>
              İsme göre (A → Z)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("name-desc")}>
              İsme göre (Z → A)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy("date-desc")}>
              Tarihe göre (En yeni → En eski)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("date-asc")}>
              Tarihe göre (En eski → En yeni)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '400px' }}>
          <table className="w-full">
            <thead className="border-b bg-muted/50 sticky top-0 z-10">
              <tr>
                <th className="w-8 px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {/* Expand column */}
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground" style={{ width: 300 }}>
                  KRİTER ADI
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground" style={{ width: 100 }}>
                  KISA AD
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground" style={{ width: 100 }}>
                  DİL
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground" style={{ width: 100 }}>
                  DURUM
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground" style={{ width: 100 }}>
                  TARİH
                </th>
                <th className="w-12 px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {/* Actions column */}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedRows.map((row, index) => {
                const rowKey = `root-${row.id}`;
                const canExpand = (row.translations?.length ?? 0) > 0;
                const isExpanded = expandedKeys.has(rowKey);
                const isSelected = selectedRowKey === rowKey;

                return (
                  <React.Fragment key={rowKey}>
                    {/* Root Row */}
                    <tr
                      className={`transition-colors cursor-pointer hover:bg-muted/40 ${
                        isSelected ? "bg-primary/10 border-l-4 border-primary" : ""
                      } ${index % 2 === 1 ? "bg-muted/30" : "bg-card"}`}
                      onClick={() => onRowSelect?.(row)}
                    >
                      <td className="px-4 py-2">
                        {canExpand ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpanded(rowKey);
                            }}
                            className="text-muted-foreground hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                            aria-expanded={isExpanded}
                            aria-label={isExpanded ? "Satırı daralt" : "Satırı genişlet"}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        ) : null}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{row.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{row.shortName}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{row.language}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <StatusBadge value={row.status as StatusNum} />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{row.date}</td>
                      <td className="px-4 py-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              className="rounded p-2 text-muted-foreground hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              aria-label="Satır işlemleri"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => actions.onView(row)}>
                              <Eye className="mr-2 h-4 w-4" /> Detayını Gör
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => actions.onEdit(row)}>
                              <Edit className="mr-2 h-4 w-4" /> Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => actions.onActivate(row)}>
                              <Power className="mr-2 h-4 w-4" /> Devreye Al
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => actions.onTranslate(row)}>
                              <Plus className="mr-2 h-4 w-4" /> Tercüme Ekle
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => actions.onDelete(row)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Sil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>

                    {/* Child Rows */}
                    {isExpanded && row.translations?.map((translation) => {
                      const childKey = `trans-${row.id}-${translation.id}`;
                      const isChildSelected = selectedRowKey === childKey;

                      return (
                        <tr
                          key={childKey}
                          className={`transition-colors cursor-pointer hover:bg-muted/40 ${
                            isChildSelected ? "bg-primary/10 border-l-4 border-primary" : "bg-muted/30"
                          }`}
                          onClick={() => {
                            actions.onSelectTranslation?.(row, translation);
                            actions.onSelectLanguage?.(row, translation.language);
                          }}
                        >
                          <td className="px-4 py-2">
                            {/* Empty cell for alignment */}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex items-center gap-2 pl-2">
                              <Languages className="h-4 w-4 text-muted-foreground" />
                              {translation.name}
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">{translation.shortName}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{translation.language}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <StatusBadge value={translation.status as StatusNum} />
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">{translation.date}</td>
                          <td className="px-4 py-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  className="rounded p-2 text-muted-foreground hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                  aria-label="Satır işlemleri"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                {actions.onTransView && (
                                  <DropdownMenuItem onClick={() => actions.onTransView!(row, translation)}>
                                    <Eye className="mr-2 h-4 w-4" /> Detayını Gör
                                  </DropdownMenuItem>
                                )}
                                {actions.onTransEdit && (
                                  <DropdownMenuItem onClick={() => actions.onTransEdit!(row, translation)}>
                                    <Edit className="mr-2 h-4 w-4" /> Düzenle
                                  </DropdownMenuItem>
                                )}
                                {actions.onTransActivate && (
                                  <DropdownMenuItem onClick={() => actions.onTransActivate!(row, translation)}>
                                    <Power className="mr-2 h-4 w-4" /> Devreye Al
                                  </DropdownMenuItem>
                                )}
                                {(actions.onTransView || actions.onTransEdit || actions.onTransActivate) && <DropdownMenuSeparator />}
                                {actions.onTransDelete && (
                                  <DropdownMenuItem
                                    onClick={() => actions.onTransDelete!(row, translation)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" /> Sil
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
