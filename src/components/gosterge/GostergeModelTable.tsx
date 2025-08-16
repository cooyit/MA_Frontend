//src/components/gosterge/GostergeModelTable.tsx

"use client";

import { DataTable } from "@/components/common/DataTable";

export type GostergeModelSummary = {
  id: number;
  name: string;
  boyutName: string;
  kriterName?: string;
  boyutWeight: number;
  kriterWeight: number;
  gostergeWeight: number;
  modelWeight: number;
  seviye: string;
  hiyerarsiTipi: string;
};

export default function GostergeModelTable({ rows, loading }: { rows: GostergeModelSummary[]; loading?: boolean }) {
  return (
    <DataTable<GostergeModelSummary>
      data={rows}
      loading={loading}
      rowKey={(r, i) => String(r.id ?? i)}
      columns={[
        { key: "name", title: "Model Adı", align: "left" },
        { key: "boyutName", title: "Boyut Adı", align: "center", width: 160 },
        { key: "kriterName", title: "Kriter Adı", align: "center", width: 160, render: (v) => v || "Boyut-Gösterge Hiyerarşisi" },
        { key: "boyutWeight", title: "Boyut Ağırlığı", align: "center", width: 140 },
        { key: "kriterWeight", title: "Kriter Ağırlığı", align: "center", width: 140 },
        { key: "gostergeWeight", title: "Gösterge Ağırlığı", align: "center", width: 140 },
        { key: "modelWeight", title: "Model Ağırlığı", align: "center", width: 140 },
        { key: "seviye", title: "Seviye", align: "center", width: 180, render: (v) => v || "-" },
      ]}
      emptyText="Model bulunamadı"
      stickyHeader
      scrollY={200}
      striped
    />
  );
}
