//src/components/model/ModelHome.tsx

"use client";

import * as React from "react";
import ModelToolbar from "./ModelToolbar";
import ModelTable, { type ModelRow, type ModelChild } from "./ModelTable";
import ModelDetailTable, { type ModelDetailSummary } from "./ModelDetailTable";
import { fetchModels, fetchModelDetails } from "@/services/modelService";
import { mapApiToRow, type ModelRowUI } from "./normalize";
import { toStatusNumber } from "@/lib/status";

// tarih kısayolu
const fmt = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("tr-TR") : "");

export default function ModelHome() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "draft" | "passive">("all");
  const [languageFilter, setLanguageFilter] = React.useState<string | "all" | "multiple">("all");
  const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>([]);

  const [rows, setRows] = React.useState<ModelRow[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [selected, setSelected] = React.useState<ModelRow | null>(null);
  const [selectedChild, setSelectedChild] = React.useState<ModelChild | null>(null);

  const [details, setDetails] = React.useState<ModelDetailSummary[]>([]);
  const [detailsLoading, setDetailsLoading] = React.useState(false);

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

    fetchModels(ctrl.signal)
      .then((data) => {
        const mapped = data.map(mapApiToRow) as ModelRowUI[];
        const filtered = applyFilters(mapped, { search, statusFilter, languageFilter, selectedLanguages });
        const final = filtered.map((r) => ({
          ...r,
          date: fmt(r.date),
          children: r.children?.map((t) => ({ ...t, date: fmt(t.date) })),
        })) as unknown as ModelRow[];
        setRows(final);
      })
      .catch((e) => {
        if (e.name !== "AbortError") console.error("fetchModels", e);
        setRows([]);
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [search, statusFilter, languageFilter, selectedLanguages]);

  // Detayları yükle (gerçek veriler)
  React.useEffect(() => {
    if (!selected && !selectedChild) {
      setDetails([]);
      return;
    }

    const modelId = selectedChild ? selectedChild.id : selected!.id;
    
    setDetailsLoading(true);
    
    const ctrl = new AbortController();
    
    fetchModelDetails(Number(modelId), ctrl.signal)
      .then((data) => {
        const mappedDetails: ModelDetailSummary[] = data.map((item) => ({
          id: item.modelId,
          userType: item.kullaniciTuruAdi,
          dimensionCount: item.boyutSayisi,
          criteriaCount: item.kriterSayisi,
          indicatorCount: item.gostergeSayisi,
          answerStatus: item.cevapEklenmeDurumu,
          status: item.aktif,
        }));
        setDetails(mappedDetails);
      })
      .catch((e) => {
        if (e.name !== "AbortError") console.error("fetchModelDetails", e);
        setDetails([]);
      })
      .finally(() => setDetailsLoading(false));

    return () => ctrl.abort();
  }, [selected, selectedChild]);

  const actions = {
    onView: (row: ModelRow) => console.log("view", row),
    onEdit: (row: ModelRow) => console.log("edit", row),
    onDelete: (row: ModelRow) => console.log("delete", row),
    onActivate: (row: ModelRow) => console.log("activate", row),
    onTranslate: (row: ModelRow) => console.log("translate", row),
    onChildView: (parent: ModelRow, t: ModelChild) => console.log("child view", parent, t),
    onChildEdit: (parent: ModelRow, t: ModelChild) => console.log("child edit", parent, t),
    onChildActivate: (parent: ModelRow, t: ModelChild) => console.log("child activate", parent, t),
    onChildDelete: (parent: ModelRow, t: ModelChild) => console.log("child delete", parent, t),

    onSelectChild: (parent: ModelRow, t: ModelChild) => {
      setSelected(parent);
      setSelectedChild(t);
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Toolbar */}
      <ModelToolbar
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
            <h3 className="text-lg font-medium">Modeller</h3>
          </div>
          <div className="p-0">
            <ModelTable
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

        {/* Detail Tables */}
        {(selected && detailsLoading) && (
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-4 border-b border-border/50">
              <h3 className="text-lg font-medium">
                {(selectedChild ? selectedChild.name : selected.name) + " Detay Bilgileri"}
              </h3>
            </div>
            <div className="p-0">
              <ModelDetailTable rows={[]} loading={true} />
            </div>
          </div>
        )}
        
        {(selected && !detailsLoading && details.length > 0) && (
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-4 border-b border-border/50">
              <h3 className="text-lg font-medium">
                {(selectedChild ? selectedChild.name : selected.name) + " Detay Bilgileri"}
              </h3>
            </div>
            <div className="p-0">
              <ModelDetailTable rows={details} loading={false} />
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
  items: ModelRowUI[],
  params: {
    search: string;
    statusFilter: "all" | "active" | "draft" | "passive";
    languageFilter: string | "all" | "multiple";
    selectedLanguages: string[];
  }
) {
  const { search, statusFilter, languageFilter, selectedLanguages } = params;
  const q = search.trim().toLowerCase();

  const projected: ModelRowUI[] =
    languageFilter === "all"
      ? items
      : languageFilter === "multiple"
      ? items.flatMap((r): ModelRowUI[] => {
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
              hierarchy: t.hierarchy,
              type: t.type,
              hospitalTypes: t.hospitalTypes,
              scope: t.scope,
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
                hierarchy: t.hierarchy,
                type: t.type,
                hospitalTypes: t.hospitalTypes,
                scope: t.scope,
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
