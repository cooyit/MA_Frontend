//src/components/model/ModelTable.tsx

"use client";

import * as React from "react";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Eye, Edit, Power, Plus, Trash2, MoreHorizontal, Languages } from "lucide-react";
import type { StatusNum } from "@/lib/status";

export type ModelChild = {
  id: number;
  language: string;
  name: string;
  shortName: string;
  status: StatusNum | "Aktif" | "Taslak" | "Pasif";
  date?: string;
  hierarchy: string;
  type: string;
  hospitalTypes: string[];
  scope: string;
};

export type ModelRow = {
  id: string | number;
  name: string;
  shortName: string;
  language: string;
  status: StatusNum | "Aktif" | "Taslak" | "Pasif";
  date?: string;
  hierarchy: string;
  type: string;
  hospitalTypes: string[];
  scope: string;
  children?: ModelChild[];
};

type Actions = {
  onView: (row: ModelRow) => void;
  onEdit: (row: ModelRow) => void;
  onDelete: (row: ModelRow) => void;
  onActivate: (row: ModelRow) => void;
  onTranslate: (row: ModelRow) => void;

  onChildView?: (parent: ModelRow, t: ModelChild) => void;
  onChildEdit?: (parent: ModelRow, t: ModelChild) => void;
  onChildActivate?: (parent: ModelRow, t: ModelChild) => void;
  onChildDelete?: (parent: ModelRow, t: ModelChild) => void;

  onSelectChild?: (parent: ModelRow, t: ModelChild) => void;
  onSelectLanguage?: (parent: ModelRow, language: string) => void;
};

type Props = {
  rows: ModelRow[];
  loading?: boolean;
  onRowSelect?: (row: ModelRow) => void;
  selectedRowKey?: string;
  actions: Actions;
};

export default function ModelTable({ rows, loading, onRowSelect, selectedRowKey, actions }: Props) {
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

      <DataTable<ModelRow>
        data={rows}
        loading={loading}
        rowKey={(r) => `root-${r.id}`}
        columns={[
          { key: "name", title: "MODEL ADI", width: 280, cellClassName: "cursor-pointer" },
          { key: "shortName", title: "MODEL KISA ADI", width: 120, cellClassName: "cursor-pointer" },
          { key: "language", title: "DİL", width: 140 },
          { key: "hierarchy", title: "HİYERARŞİ", width: 200 },
          { key: "type", title: "TÜR", width: 160 },
          { key: "hospitalTypes", title: "HASTANE TÜRLERİ", width: 200, render: (v) => (
            <div className="flex flex-wrap gap-1">
              {(v as string[] || []).map((type, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {type}
                </span>
              ))}
            </div>
          )},
          { key: "scope", title: "KAPSAM", width: 140 },
          { key: "status", title: "DURUM", width: 140, render: (v) => <StatusBadge value={v as any} /> },
          { key: "date", title: "TARİH", width: 140 },
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
  parent: ModelRow;
  items: ModelChild[];
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
          aria-label={`Alt Model: ${t.language}`}
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
          <div className="col-span-1 text-sm text-muted-foreground">{t.language}</div>
          <div className="col-span-2 text-sm text-muted-foreground">{t.hierarchy}</div>
          <div className="col-span-2 text-sm text-muted-foreground">{t.type}</div>
          <div className="col-span-2">
            <StatusBadge value={t.status as any} />
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
      {items.length === 0 && <div className="px-2 py-1 text-xs text-muted-foreground">Alt model bulunamadı</div>}
    </div>
  );
}

