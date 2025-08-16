//src/components/gosterge/GostergeTable.tsx

"use client";

import * as React from "react";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Eye, Edit, Power, Plus, Trash2, MoreHorizontal, Languages, Tag } from "lucide-react";
import type { StatusNum } from "@/lib/status";

export type GostergeChild = {
  id: number;
  language: string;
  name: string;
  shortName: string;
  status: StatusNum | "Aktif" | "Taslak" | "Pasif";
  date?: string;
  cevapTuruAdlari: string[];
};

export type GostergeRow = {
  id: string | number;
  name: string;
  shortName: string;
  language: string;
  status: StatusNum | "Aktif" | "Taslak" | "Pasif";
  date?: string;
  cevapTuruAdlari: string[];
  children?: GostergeChild[];
};

type Actions = {
  onView: (row: GostergeRow) => void;
  onEdit: (row: GostergeRow) => void;
  onDelete: (row: GostergeRow) => void;
  onActivate: (row: GostergeRow) => void;
  onTranslate: (row: GostergeRow) => void;

  onChildView?: (parent: GostergeRow, t: GostergeChild) => void;
  onChildEdit?: (parent: GostergeRow, t: GostergeChild) => void;
  onChildActivate?: (parent: GostergeRow, t: GostergeChild) => void;
  onChildDelete?: (parent: GostergeRow, t: GostergeChild) => void;

  onSelectChild?: (parent: GostergeRow, t: GostergeChild) => void;
  onSelectLanguage?: (parent: GostergeRow, language: string) => void;
};

type Props = {
  rows: GostergeRow[];
  loading?: boolean;
  onRowSelect?: (row: GostergeRow) => void;
  selectedRowKey?: string;
  actions: Actions;
};

export default function GostergeTable({ rows, loading, onRowSelect, selectedRowKey, actions }: Props) {
  const [expandedKeys, setExpandedKeys] = React.useState<Set<string>>(new Set());

  const expandableRows = rows.filter(r => (r.children?.length ?? 0) > 0);
  const allExpanded = expandableRows.length > 0 && expandedKeys.size === expandableRows.length;

  const expandAll = () => {
    const keys = expandableRows.map(r => `root-${r.id}`);
    setExpandedKeys(new Set(keys));
  };

  const collapseAll = () => {
    setExpandedKeys(new Set());
  };

  const handleExpandChange = (keys: string[]) => {
    setExpandedKeys(new Set(keys));
  };

  return (
    <div className="space-y-2">
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
      
      <DataTable<GostergeRow>
        data={rows}
        loading={loading}
        rowKey={(r) => `root-${r.id}`}
        columns={[
          { key: "name", title: "GÖSTERGE ADI", width: 280, cellClassName: "cursor-pointer" },
          { key: "shortName", title: "KISA AD", width: 120, cellClassName: "cursor-pointer" },
          { key: "language", title: "DİL", width: 140 },
          { key: "status", title: "DURUM", width: 140, render: (v) => <StatusBadge value={v as any} /> },
          { key: "date", title: "TARİH", width: 140 },
          { key: "cevapTuruAdlari", title: "CEVAP TÜRLERİ", width: 200, render: (v) => (
            <div className="flex flex-wrap gap-1">
              {(v as string[] || []).map((tur, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  <Tag className="w-3 h-3 mr-1" />
                  {tur}
                </span>
              ))}
            </div>
          )},
        ]}
        expandable={{
          rowExpandable: (r) => (r.children?.length ?? 0) > 0,
          expandedRowKeys: Array.from(expandedKeys),
          onExpandChange: handleExpandChange,
          expandedRowRender: (record) => (
            <ChildRows parent={record} items={record.children ?? []} actions={actions} selectedRowKey={selectedRowKey} />
          ),
        }}
        actions={{
          items: [
            { key: "view", label: "Detayını Gör", icon: <Eye className="h-4 w-4" />, onClick: actions.onView },
            { key: "edit", label: "Düzenle", icon: <Edit className="h-4 w-4" />, onClick: actions.onEdit },
            { key: "activate", label: "Devreye Al", icon: <Power className="h-4 w-4" />, onClick: actions.onActivate },
            { key: "translate", label: "Tercüme Ekle", icon: <Plus className="h-4 w-4" />, onClick: actions.onTranslate },
            { key: "delete", label: "Sil", icon: <Trash2 className="h-4 w-4" />, onClick: actions.onDelete, danger: true },
          ],
        }}
        onRowClick={(row) => onRowSelect?.(row)}
        selectedRowKey={selectedRowKey}
        striped
        stickyHeader
        scrollY={300}
        emptyText="Kayıt bulunamadı"
      />
    </div>
  );
}

function ChildRows({
  parent,
  items,
  actions,
  selectedRowKey,
}: {
  parent: GostergeRow;
  items: GostergeChild[];
  actions: Actions;
  selectedRowKey?: string;
}) {
  return (
    <div className="space-y-1">
      {items.map((t, idx) => (
        <div
          key={`child-${parent.id}-${t.id}`}
          className={`grid grid-cols-12 items-center gap-2 rounded-md border border-border/50 px-3 py-2 cursor-pointer hover:bg-muted/50 ${
            selectedRowKey === `child-${parent.id}-${t.id}` 
              ? "bg-primary/10 border-l-4 border-primary" 
              : "bg-muted/30"
          }`}
          role="row"
          aria-label={`Alt Gösterge: ${t.language}`}
          onClick={() => {
            actions.onSelectChild?.(parent, t);
            actions.onSelectLanguage?.(parent, t.language);
          }}
        >
          <div className="col-span-1 flex items-center">
            <Languages className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="col-span-2 text-sm text-muted-foreground cursor-pointer">{t.name}</div>
          <div className="col-span-2 text-sm text-muted-foreground cursor-pointer">{t.shortName}</div>
          <div className="col-span-2 text-sm text-muted-foreground">{t.language}</div>
          <div className="col-span-2">
            <StatusBadge value={t.status as any} />
          </div>
          <div className="col-span-3 flex flex-wrap gap-1">
            {(t.cevapTuruAdlari || []).map((tur, idx) => (
              <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <Tag className="w-3 h-3 mr-1" />
                {tur}
              </span>
            ))}
          </div>
          <div className="col-span-2 flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {actions.onChildView && (
                  <DropdownMenuItem onClick={() => actions.onChildView!(parent, t)}>
                    <Eye className="mr-2 h-4 w-4" /> Detayını Gör
                  </DropdownMenuItem>
                )}
                {actions.onChildEdit && (
                  <DropdownMenuItem onClick={() => actions.onChildEdit!(parent, t)}>
                    <Edit className="mr-2 h-4 w-4" /> Düzenle
                  </DropdownMenuItem>
                )}
                {actions.onChildActivate && (
                  <DropdownMenuItem onClick={() => actions.onChildActivate!(parent, t)}>
                    <Power className="mr-2 h-4 w-4" /> Devreye Al
                  </DropdownMenuItem>
                )}
                {(actions.onChildView || actions.onChildEdit || actions.onChildActivate) && <DropdownMenuSeparator />}
                {actions.onChildDelete && (
                  <DropdownMenuItem
                    onClick={() => actions.onChildDelete!(parent, t)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Sil
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
      {items.length === 0 && <div className="px-2 py-1 text-xs text-muted-foreground">Alt gösterge bulunamadı</div>}
    </div>
  );
}

