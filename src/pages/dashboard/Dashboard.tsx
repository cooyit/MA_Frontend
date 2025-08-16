import React from "react";
import { BarChart3, Database, TrendingUp, Users, Settings, Activity } from "lucide-react";
import AppCard from "@/components/common/AppCard";
import MenuList from "@/components/common/MenuList";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { Helmet } from "react-helmet-async";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { setPageTitle } = usePageTitle();

  // Sayfa başlığını ayarla
  React.useEffect(() => {
    setPageTitle('Hastane 4.0');
  }, [setPageTitle]);

  const measurementItems = [
    { label: "Modeller", count: 12, onClick: () => navigate("/modeller") },
    { label: "Boyutlar", count: 8, onClick: () => navigate("/boyutlar") }, // <- yeni sayfa
    { label: "Kriterler", count: 24, onClick: () => navigate("/kriterler") },
    { label: "Göstergeler", count: 156, onClick: () => navigate("/gostergeler") }
  ];

  const basicItems = [
    { label: "Diller", count: 3, onClick: () => navigate("/diller") },
    { label: "Ülkeler", count: 15, onClick: () => navigate("/ulkeler") },
    { label: "Şehirler", count: 81, onClick: () => navigate("/sehirler") },
    { label: "Hastaneler", count: 45, onClick: () => navigate("/hastaneler") },
    { label: "Kullanıcılar", count: 234, onClick: () => navigate("/kullanicilar") }
  ];

  const classificationItems = [
    { label: "Hastane Türleri", count: 6, onClick: () => navigate("/hastane-turleri") },
    { label: "Kullanıcı Türleri", count: 4, onClick: () => navigate("/kullanici-turleri") },
    { label: "Seviyeler", count: 5, onClick: () => navigate("/seviyeler") },
    { label: "Gösterge Çevap Türleri", count: 8, onClick: () => navigate("/gosterge-cevap-turleri") },
    { label: "Karşılaştırma Düzeyleri", count: 3, onClick: () => navigate("/karsilanma-duzeyleri") }
  ];

  const assignmentItems = [
    { label: "Model Ülke", count: 28, onClick: () => navigate("/model-ulke-atamalari") },
    { label: "Model Hastane Kullanıcı", count: 156, onClick: () => navigate("/model-hastane-kullanici-atamalari") }
  ];

  const recentActivities = [
    { label: "Yeni gösterge eklendi", user: "Ahmet Emre", time: "5 dk önce", type: "success" },
    { label: "Kullanıcı sisteme kayıt oldu", user: "Büşra Gül", time: "15 dk önce", type: "info" },
    { label: "Ülkeye model atandı", user: "Türkiye, Emram Seviye 7", time: "1 g önce", type: "warning" }
  ];

  return (
    <>
      <Helmet>
        <title>Hastane 4.0</title>
      </Helmet>
      <div className="container mx-auto min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold lg:text-4xl">Hoş Geldiniz!</h1>
        <p className="max-w-prose text-muted-foreground">
          Hastane 4.0 yönetim paneline hoş geldiniz. Aşağıdaki modüllerden istediğinizi seçerek işlemlerinizi gerçekleştirebilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AppCard title="Ölçüm Tanımları" icon={<BarChart3 className="h-6 w-6" />}>
          <p className="mb-4 text-sm text-muted-foreground">Ölçüm ve değerlendirme parametreleri</p>
          <MenuList items={measurementItems} />
        </AppCard>

        <AppCard title="Temel Tanımlar" icon={<Database className="h-6 w-6" />}>
          <p className="mb-4 text-sm text-muted-foreground">Sistem temel tanımlarını yönetin</p>
          <MenuList items={basicItems} />
        </AppCard>

        <AppCard title="Son İşlemler" icon={<TrendingUp className="h-6 w-6" />}>
          <div className="space-y-3">
            {recentActivities.map((a, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-muted p-3">
                <div
                  className={`mt-2 h-2 w-2 rounded-full ${
                    a.type === "success" ? "bg-green-500" : a.type === "warning" ? "bg-yellow-500" : "bg-blue-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.user} • {a.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AppCard>

        <AppCard title="Sınıflandırma Tanımları" icon={<Users className="h-6 w-6" />}>
          <p className="mb-4 text-sm text-muted-foreground">Sistem temel tanımlarını yönetin</p>
          <MenuList items={classificationItems} />
        </AppCard>

        <AppCard title="Atamalar" icon={<Settings className="h-6 w-6" />}>
          <p className="mb-4 text-sm text-muted-foreground">Ölçüm ve değerlendirme parametreleri</p>
          <MenuList items={assignmentItems} />
        </AppCard>

        <AppCard title="Sistem Durumu" icon={<Activity className="h-6 w-6" />}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Veritabanı</span>
              {/* system status */}
              <StatusBadge value="online" labelOverride="Aktif" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Servisleri</span>
              <StatusBadge value="error" labelOverride="Çalışmıyor" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Son Yedekleme</span>
              <span className="text-xs text-muted-foreground">2 saat önce</span>
            </div>
          </div>
        </AppCard>
              </div>
      </div>
    </>
  );
};

export default Dashboard;
