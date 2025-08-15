// src/components/common/DataTable.tsx
"use client";

import * as React from "react";
import type { ReactNode } from "react";
import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Align = "left" | "center" | "right";

export interface Column<T> {
  /** Alan anahtarı; nested path destekler: "parent.child" */
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T) => ReactNode;
  width?: string | number;
  /** th için ek sınıf */
  headerClassName?: string;
  /** td için ek sınıf */
  cellClassName?: string;
  /** metin hizası */
  align?: Align;
}

export interface ActionItem<T> {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick: (record: T) => void;
  danger?: boolean;
  disabled?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  /** Satır key'i: alan adı veya fonksiyon */
  rowKey?: keyof T | ((record: T, index: number) => string);
  expandable?: {
    expandedRowRender: (record: T) => ReactNode;
    rowExpandable?: (record: T) => boolean;
    /** İlk açılışta açık olacak satır key'leri */
    defaultExpandedRowKeys?: string[];
    /** Kontrollü genişletme için açık satır key'leri */
    expandedRowKeys?: string[];
    /** Genişleyen satırlar değiştiğinde */
    onExpandChange?: (expandedKeys: string[], toggledRecord?: T) => void;
  };
  actions?: {
    items: ActionItem<T>[];
  };
  /** Zebra satırlar */
  striped?: boolean;
  /** Sticky header etkinleştir */
  stickyHeader?: boolean;
  /** Dikey scroll yüksekliği (px) -> stickyHeader ile iyi çalışır */
  scrollY?: number;
  /** Boş veri metni */
  emptyText?: string;
  /** Satır tıklama davranışı */
  onRowClick?: (record: T) => void;
  /** Satırın üzerine gelince tetikleme (opsiyonel, geriye uyumlu) */
  onRowHover?: (record: T) => void;
  /** Seçili satır key'i */
  selectedRowKey?: string;
  className?: string;
  tableClassName?: string;
}

export function DataTable<T>({
  data,
  columns,
  loading,
  rowKey,
  expandable,
  actions,
  striped = false,
  stickyHeader = false,
  scrollY,
  emptyText = "Veri bulunamadı",
  onRowClick,
  selectedRowKey,
  className,
  tableClassName,
}: DataTableProps<T>) {
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(
    () => new Set(expandable?.expandedRowKeys ?? expandable?.defaultExpandedRowKeys ?? [])
  );

  // expandedRowKeys prop'u değişirse state'i güncelle
  React.useEffect(() => {
    if (expandable?.expandedRowKeys) {
      setExpandedRows(new Set(expandable.expandedRowKeys));
    }
  }, [expandable?.expandedRowKeys]);

  const getRowKey = React.useCallback(
    (record: T, index: number): string => {
      if (typeof rowKey === "function") return rowKey(record, index);
      if (rowKey && typeof rowKey !== "function") {
        const k = rowKey as keyof T;
        const v = (record as any)?.[k];
        if (v != null) return String(v);
      }
      // Güvenli fallback
      return String(index);
    },
    [rowKey]
  );

  const getNestedValue = (obj: any, path: keyof T | string) => {
    if (typeof path !== "string") return obj?.[path as keyof T];
    if (!path.includes(".")) return obj?.[path];
    return path.split(".").reduce((acc: any, key) => (acc == null ? acc : acc[key]), obj);
  };

  const toggleExpanded = (key: string, record: T) => {
    const next = new Set(expandedRows);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setExpandedRows(next);
    expandable?.onExpandChange?.(Array.from(next), record);
  };

  // Loading state
  if (loading) {
    return (
      <div
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          "p-8 text-center",
          className
        )}
      >
        <div
          className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2"
          aria-label="Yükleniyor"
          role="status"
        />
        <p className="mt-2 text-muted-foreground">Yükleniyor...</p>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className={cn("rounded-lg border bg-card shadow-sm p-8 text-center", className)}>
        <p className="text-muted-foreground">{emptyText}</p>
      </div>
    );
  }

  const headerClasses = cn(
    "text-xs font-medium uppercase tracking-wider text-muted-foreground",
    "bg-muted/50"
  );

  const wrapClasses = cn(
    "rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden",
    className
  );

  const scrollerClass = cn("overflow-x-auto", scrollY ? "overflow-y-auto scroll-smooth" : undefined);

  const tableStyle: React.CSSProperties | undefined = scrollY ? { 
    maxHeight: scrollY,
    willChange: "scroll-position", // Scroll performansını iyileştir
    overscrollBehavior: "contain" // Scroll bounce'ı engelle
  } : undefined;

  return (
    <div className={wrapClasses}>
      <div className={scrollerClass} style={tableStyle}>
        <table className={cn("w-full", tableClassName)}>
          <thead className={cn("border-b", stickyHeader && "sticky top-0 z-10")}>
            <tr className="bg-muted/50" style={{ willChange: stickyHeader ? "transform" : undefined }}>
              {expandable && <th className="w-8" />}

              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  scope="col"
                                     className={cn("px-4 py-2 text-left", headerClasses, column.headerClassName, {
                    "text-left": (column.align ?? "left") === "left",
                    "text-center": column.align === "center",
                    "text-right": column.align === "right",
                  })}
                  style={{ width: column.width }}
                >
                  {column.title}
                </th>
              ))}

              {actions && <th className="w-12" />}
            </tr>
          </thead>

          <tbody className="divide-y">
            {data.map((record, index) => {
              const key = getRowKey(record, index);
              const canExpand = !!expandable && expandable.rowExpandable?.(record) !== false;
              const isExpanded = canExpand && expandedRows.has(key);
              const panelId = `dt-panel-${key}`;

                                           const isSelected = selectedRowKey === key;
              const baseRow =
                "transition-colors " +
                (isSelected ? "bg-primary/10 border-l-4 border-primary" : "") +
                (striped && index % 2 === 1 ? "bg-muted/30" : "bg-card") +
                " hover:bg-muted/40";

              return (
                <React.Fragment key={key}>
                                     <tr
                     className={baseRow}
                     onClick={onRowClick ? () => onRowClick(record) : undefined}
                   >
                                         {expandable && (
                       <td className="px-4 py-2">
                        {canExpand ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpanded(key, record);
                            }}
                            className="text-muted-foreground hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                            aria-expanded={isExpanded}
                            aria-controls={panelId}
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
                    )}

                    {columns.map((column) => {
                      const rawValue = getNestedValue(record, column.key);
                      return (
                        <td
                          key={String(column.key)}
                                                     className={cn(
                             "px-4 py-2 whitespace-nowrap",
                            column.cellClassName,
                            {
                              "text-left": (column.align ?? "left") === "left",
                              "text-center": column.align === "center",
                              "text-right": column.align === "right",
                            }
                          )}
                        >
                          {column.render ? column.render(rawValue, record) : String(rawValue ?? "")}
                        </td>
                      );
                    })}

                                         {actions && (
                       <td className="px-4 py-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              className="rounded p-2 text-muted-foreground hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              aria-label="Satır işlemleri"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {actions.items.map((action, idx) => {
                              const item = (
                                <DropdownMenuItem
                                  key={action.key}
                                  disabled={action.disabled}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(record);
                                  }}
                                  className={cn(
                                    "flex items-center gap-2",
                                    action.danger && "text-destructive focus:text-destructive"
                                  )}
                                >
                                  {action.icon}
                                  {action.label}
                                </DropdownMenuItem>
                              );
                              const withSep =
                                idx < actions.items.length - 1 &&
                                actions.items[idx + 1]?.danger &&
                                !action.danger ? (
                                  <React.Fragment key={action.key}>
                                    {item}
                                    <DropdownMenuSeparator />
                                  </React.Fragment>
                                ) : (
                                  item
                                );
                              return withSep;
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    )}
                  </tr>

                  {expandable && isExpanded && (
                    <tr className="bg-muted/40">
                                             <td
                         id={panelId}
                         colSpan={columns.length + (expandable ? 1 : 0) + (actions ? 1 : 0)}
                         className="px-4 py-2"
                       >
                        {expandable.expandedRowRender(record)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
