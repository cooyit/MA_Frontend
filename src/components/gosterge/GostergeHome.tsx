//src/components/gosterge/GostergeHome.tsx

"use client";

import * as React from "react";
import GostergeToolbar from "./GostergeToolbar";
import GostergeTable, { type GostergeRow, type GostergeChild } from "./GostergeTable";
import GostergeModelTable, { type GostergeModelSummary } from "./GostergeModelTable";
import { fetchGostergeTree, fetchGostergeModels } from "@/services/gostergeService";
import { mapTreeApiToRow, mapModelApiToRow, type GostergeRowUI, type GostergeModelUI } from "./normalize";
import { toStatusNumber } from "@/lib/status";

// tarih kısayolu
const fmt = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("tr-TR") : "");

export default function GostergeHome() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "draft" | "passive">("all");
  const [languageFilter, setLanguageFilter] = React.useState<string | "all" | "multiple">("all");
  const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>([]);

  const [rows, setRows] = React.useState<GostergeRow[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [selected, setSelected] = React.useState<GostergeRow | null>(null);
  const [selectedChild, setSelectedChild] = React.useState<GostergeChild | null>(null);

  const [models, setModels] = React.useState<GostergeModelSummary[]>([]);
  const [modelsLoading, setModelsLoading] = React.useState(false);

  // Seçili satır key'ini hesapla
  const selectedRowKey = React.useMemo(() => {
    if (selectedChild && selected) {
      return `child-${selected.id}-${selectedChild.id}`;
    } else if (selected) {
      return `root-${selected.id}`;
    }
    return undefined;
  }, [selected, selectedChild]);

  // Liste yükle
  React.useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);

    fetchGostergeTree(ctrl.signal)
      .then((data) => {
        const mapped = data.map(mapTreeApiToRow) as GostergeRowUI[];
        const filtered = applyFilters(mapped, { search, statusFilter, languageFilter, selectedLanguages });
        const final = filtered.map((r) => ({
          ...r,
          date: fmt(r.date),
          children: r.children?.map((t) => ({ ...t, date: fmt(t.date) })),
        })) as unknown as GostergeRow[];
        setRows(final);
      })
      .catch((e) => {
        if (e.name !== "AbortError") console.error("fetchGostergeTree", e);
        setRows([]);
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [search, statusFilter, languageFilter, selectedLanguages]);

  // Modeller yükle
  React.useEffect(() => {
    let id: string | number | undefined;
    
    if (selectedChild) {
      id = selectedChild.id;
    } else if (selected) {
      id = selected.id;
    }
    
    if (!id) {
      setModels([]);
      return;
    }
    
    const ctrl = new AbortController();
    setModelsLoading(true);

    // Model verilerini çek
    fetchGostergeModels(Number(id), ctrl.signal)
      .then((modelData) => {
        const mapped = modelData.map(mapModelApiToRow) as GostergeModelUI[];
        setModels(mapped as unknown as GostergeModelSummary[]);
      })
      .catch((e) => {
        if (e.name !== "AbortError") console.error("fetchGostergeModels", e);
        setModels([]);
      })
      .finally(() => setModelsLoading(false));

    return () => ctrl.abort();
  }, [selected, selectedChild]);

  const actions = {
    onView: (row: GostergeRow) => console.log("view", row),
    onEdit: (row: GostergeRow) => console.log("edit", row),
    onDelete: (row: GostergeRow) => console.log("delete", row),
    onActivate: (row: GostergeRow) => console.log("activate", row),
    onTranslate: (row: GostergeRow) => console.log("translate", row),
    onChildView: (parent: GostergeRow, t: GostergeChild) => console.log("child view", parent, t),
    onChildEdit: (parent: GostergeRow, t: GostergeChild) => console.log("child edit", parent, t),
    onChildActivate: (parent: GostergeRow, t: GostergeChild) => console.log("child activate", parent, t),
    onChildDelete: (parent: GostergeRow, t: GostergeChild) => console.log("child delete", parent, t),

    onSelectChild: (parent: GostergeRow, t: GostergeChild) => {
      setSelected(parent);
      setSelectedChild(t);
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Toolbar */}
      <GostergeToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        languageFilter={languageFilter}
        onLanguageFilterChange={setLanguageFilter}
        selectedLanguages={selectedLanguages}
        onSelectedLanguagesChange={setSelectedLanguages}
        onCreate={() => console.log("create")}
        onRefresh={() => {
          window.location.reload();
        }}
        hints={rows.map(r => r.name).filter(Boolean)}
      />

      {/* Content Area */}
      <div className="p-6 space-y-6">
        {/* Main Table */}
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-4 border-b border-border/50">
            <h3 className="text-lg font-medium">Gösterge Listesi</h3>
          </div>
          <div className="p-0">
            <GostergeTable
              rows={rows}
              loading={loading}
              onRowSelect={(row) => {
                setSelected(row);
                setSelectedChild(null);
              }}
              selectedRowKey={selectedRowKey}
              actions={actions}
            />
          </div>
        </div>

        {/* Model Tables */}
        {(selected && modelsLoading) && (
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-4 border-b border-border/50">
              <h3 className="text-lg font-medium">
                {(selectedChild ? selectedChild.name : selected.name) + " • Modeller"}
              </h3>
            </div>
            <div className="p-0">
              <GostergeModelTable rows={[]} loading={true} />
            </div>
          </div>
        )}
        
        {(selected && !modelsLoading && models.length > 0) && (
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-4 border-b border-border/50">
              <h3 className="text-lg font-medium">
                {(selectedChild ? selectedChild.name : selected.name) + " • Modeller"}
              </h3>
            </div>
            <div className="p-0">
              <GostergeModelTable rows={models} loading={false} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------- Filtre ----------------- */

function normalizeLang(s: string) {
  return s
    .trim()
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function applyFilters(
  items: GostergeRowUI[],
  params: {
    search: string;
    statusFilter: "all" | "active" | "draft" | "passive";
    languageFilter: string | "all" | "multiple";
    selectedLanguages: string[];
  }
) {
  const { search, statusFilter, languageFilter, selectedLanguages } = params;
  const q = search.trim().toLowerCase();

  const projected: GostergeRowUI[] =
    languageFilter === "all"
      ? items
      : languageFilter === "multiple"
      ? items.flatMap((r): GostergeRowUI[] => {
          const wantedLanguages = selectedLanguages.map(lang => normalizeLang(lang));
          
          const rootMatches = wantedLanguages.some(wanted => 
            normalizeLang(r.language) === wanted
          );
          
          if (rootMatches) {
            const filteredChildren = r.children?.filter(t => 
              wantedLanguages.some(wanted => normalizeLang(t.language) === wanted)
            ) || [];
            return [{ ...r, children: filteredChildren }];
          }
          
          const matchingChildren = r.children?.filter(t => 
            wantedLanguages.some(wanted => normalizeLang(t.language) === wanted)
          ) || [];
          
          if (matchingChildren.length > 0) {
            return matchingChildren.map(t => ({
              id: t.id,
              name: t.name,
              shortName: t.shortName,
              language: t.language,
              status: t.status,
              date: t.date || "",
              cevapTuruAdlari: t.cevapTuruAdlari,
              children: [],
            }));
          }
          
          return [];
        })
      : items.flatMap((r) => {
          const wanted = normalizeLang(String(languageFilter));

          if (normalizeLang(r.language) === wanted) {
            return [{ ...r, children: [] }];
          }

          const t = r.children?.find((x) => normalizeLang(x.language) === wanted);
          if (t) {
            return [
              {
                id: t.id,
                name: t.name,
                shortName: t.shortName,
                language: t.language,
                status: t.status,
                date: t.date,
                cevapTuruAdlari: t.cevapTuruAdlari,
                children: [],
              },
            ];
          }

          return [];
        });

  return projected.filter((r) => {
    const matchesSearch =
      !q || r.name.toLowerCase().includes(q) || r.shortName.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "all" ||
      toStatusNumber(r.status) === (statusFilter === "active" ? 1 : statusFilter === "draft" ? 2 : 0);

    return matchesSearch && matchesStatus;
  });
}
