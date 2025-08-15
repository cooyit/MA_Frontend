//src/components/boyut/ModelTable.tsx

"use client";

import { DataTable } from "@/components/common/DataTable";

export type ModelSummary = {
  id?: string | number;
  name: string;
  criteriaCount: number;
  indicatorCount: number;
  weight: number;
  coverageLevel: string;
};

export default function ModelTable({ rows, loading }: { rows: ModelSummary[]; loading?: boolean }) {
  return (
    <DataTable<ModelSummary>
      data={rows}
      loading={loading}
      rowKey={(r, i) => String(r.id ?? i)}
      columns={[
        { key: "name", title: "Model Adı", align: "center" },
        { key: "criteriaCount", title: "Kriter Sayısı", align: "center", width: 140 },
        { key: "indicatorCount", title: "Gösterge Sayısı", align: "center", width: 160 },
        { key: "weight", title: "Model Ağırlığı", align: "center", width: 140 },
      ]}
      emptyText="Model bulunamadı"
      stickyHeader
             scrollY={200}
             striped
    />
  );
}
