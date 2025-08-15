//src/components/kriter/KriterModelTable.tsx

"use client";

import { DataTable } from "@/components/common/DataTable";

export type KriterModelSummary = {
  id: number;
  name: string;
  boyutName: string;
  boyutWeight: number;
  kriterWeight: number;
  modelWeight: number;
  gostergeSayisi: number;
  seviye: string;
};

export default function KriterModelTable({ rows, loading }: { rows: KriterModelSummary[]; loading?: boolean }) {
  return (
    <DataTable<KriterModelSummary>
      data={rows}
      loading={loading}
      rowKey={(r, i) => String(r.id ?? i)}
      columns={[
        { key: "name", title: "Model Adı", align: "left" },
        { key: "boyutName", title: "Boyut Adı", align: "center", width: 160 },
        { key: "boyutWeight", title: "Boyut Ağırlığı", align: "center", width: 140 },
        { key: "kriterWeight", title: "Kriter Ağırlığı", align: "center", width: 140 },
        { key: "modelWeight", title: "Model Ağırlığı", align: "center", width: 140 },
        { key: "gostergeSayisi", title: "Gösterge Sayısı", align: "center", width: 140 },
        { key: "seviye", title: "Seviye", align: "center", width: 180 },
      ]}
      emptyText="Model bulunamadı"
      stickyHeader
      scrollY={200}
      striped
    />
  );
}
