//src/components/gosterge/GostergeHome.tsx

"use client";

import * as React from "react";
import GostergeToolbar from "./GostergeToolbar";
import GostergeTable, { type GostergeRow, type GostergeChild } from "./GostergeTable";
import GostergeModelTable, { type GostergeModelSummary } from "./GostergeModelTable";
import { fetchGostergeTree, fetchGostergeModels } from "@/services/gostergeService";
import { mapTreeApiToRow, mapModelApiToRow, type GostergeRowUI, type GostergeModelUI } from "./normalize";
import { toStatusNumber } from "@/lib/status";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { Helmet } from "react-helmet-async";

// tarih kısayolu
const fmt = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("tr-TR") : "");

export default function GostergeHome() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "draft" | "passive" | "multiple">("all");
  const [selectedStatuses, setSelectedStatuses] = React.useState<number[]>([]);
  const [languageFilter, setLanguageFilter] = React.useState<string | "all" | "multiple">("all");
  const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>([]);
  const { setPageTitle } = usePageTitle();

  // Sayfa başlığını ayarla
  React.useEffect(() => {
    setPageTitle('Göstergeler');
  }, [setPageTitle]);

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
        const filtered = applyFilters(mapped, { search, statusFilter, selectedStatuses, languageFilter, selectedLanguages });
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
  }, [search, statusFilter, selectedStatuses, languageFilter, selectedLanguages]);

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
    <>
      <Helmet>
        <title>Göstergeler</title>
      </Helmet>
      <div className="min-h-screen bg-background">
      {/* Modern Toolbar */}
      <GostergeToolbar
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onSelectedStatusesChange={setSelectedStatuses}
        onLanguageFilterChange={setLanguageFilter}
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
    </>
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
    statusFilter: "all" | "active" | "draft" | "passive" | "multiple";
    selectedStatuses: number[];
    languageFilter: string | "all" | "multiple";
    selectedLanguages: string[];
  }
) {
  const { search, statusFilter, selectedStatuses, languageFilter, selectedLanguages } = params;
  const q = search.trim().toLowerCase();

  // Önce language filtrelemesi yap
  const languageFiltered: GostergeRowUI[] =
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

  // Sonra status filtrelemesi yap - child kayıtları da root kayıt gibi göster
  return languageFiltered.flatMap((r) => {
    const matchesSearch =
      !q || r.name.toLowerCase().includes(q) || r.shortName.toLowerCase().includes(q);

    const results: GostergeRowUI[] = [];

    // Status filtrelemesi için statusFilter'ı parse et
    let statusesToCheck: number[] = [];
    if (statusFilter === "all") {
      statusesToCheck = [0, 1, 2]; // Pasif, Aktif, Taslak
    } else if (statusFilter === "multiple") {
      statusesToCheck = selectedStatuses;
    } else if (statusFilter === "active") {
      statusesToCheck = [1];
    } else if (statusFilter === "draft") {
      statusesToCheck = [2];
    } else if (statusFilter === "passive") {
      statusesToCheck = [0];
    }

    // Root kayıt status kontrolü
    const rootStatus = toStatusNumber(r.status);
    const rootMatchesStatus = statusesToCheck.includes(rootStatus);

    // Root kayıt eşleşiyorsa ekle (child'ları ile birlikte)
    if (matchesSearch && rootMatchesStatus) {
      // Root kayıt eşleşiyorsa, child'ları da filtrele
      const filteredChildren = r.children?.filter(child => {
        const childStatus = toStatusNumber(child.status);
        return statusesToCheck.includes(childStatus);
      }) || [];
      
      results.push({
        ...r,
        children: filteredChildren
      });
    }

    // Child kayıtları ayrı root kayıt gibi ekle (sadece root eşleşmiyorsa)
    if (matchesSearch && !rootMatchesStatus && r.children) {
      r.children.forEach(child => {
        const childStatus = toStatusNumber(child.status);
        if (statusesToCheck.includes(childStatus)) {
          results.push({
            id: child.id,
            name: child.name,
            shortName: child.shortName,
            language: child.language,
            status: child.status,
            date: child.date || "",
            cevapTuruAdlari: child.cevapTuruAdlari,
            children: [], // Child'ı root yaptığımız için children'ı boş bırak
          });
        }
      });
    }

    return results;
  });
}
