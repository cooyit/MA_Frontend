import type React from "react"
import {
  BarChart3,
  Database,
  TrendingUp,
  Users,
  Settings,
  Activity
} from "lucide-react"
import { Card } from "../../components/common/Card"
import { MenuList } from "../../components/common/MenuList"
import { StatusBadge } from "../../components/common/StatusBadge"
import { useNavigate } from "react-router-dom"

export const Dashboard: React.FC = () => {
  const navigate = useNavigate()

  const measurementItems = [
    { label: "Modeller", count: 12, onClick: () => navigate("/modeller") },
    { label: "Boyutlar", count: 8, onClick: () => navigate("/boyutlar") },
    { label: "Kriterler", count: 24, onClick: () => navigate("/kriterler") },
    { label: "Göstergeler", count: 156, onClick: () => navigate("/gostergeler") }
  ]

  const basicItems = [
    { label: "Diller", count: 3, onClick: () => navigate("/diller") },
    { label: "Ülkeler", count: 15, onClick: () => navigate("/ulkeler") },
    { label: "Şehirler", count: 81, onClick: () => navigate("/sehirler") },
    { label: "Hastaneler", count: 45, onClick: () => navigate("/hastaneler") },
    { label: "Kullanıcılar", count: 234, onClick: () => navigate("/kullanicilar") }
  ]

  const classificationItems = [
    { label: "Hastane Türleri", count: 6, onClick: () => navigate("/hastane-turleri") },
    { label: "Kullanıcı Türleri", count: 4, onClick: () => navigate("/kullanici-turleri") },
    { label: "Seviyeler", count: 5, onClick: () => navigate("/seviyeler") },
    { label: "Gösterge Çevap Türleri", count: 8, onClick: () => navigate("/gosterge-cevap-turleri") },
    { label: "Karşılaştırma Düzeyleri", count: 3, onClick: () => navigate("/karsilanma-duzeyleri") }
  ]

  const assignmentItems = [
    { label: "Model Ülke", count: 28, onClick: () => navigate("/model-ulke-atamalari") },
    { label: "Model Hastane Kullanıcı", count: 156, onClick: () => navigate("/model-hastane-kullanici-atamalari") }
  ]

  const recentActivities = [
    { label: "Yeni gösterge eklendi", user: "Ahmet Emre", time: "5 dk önce", type: "success" },
    { label: "Kullanıcı sisteme kayıt oldu", user: "Büşra Gül", time: "15 dk önce", type: "info" },
    { label: "Ülkeye model atandı", user: "Türkiye, Emram Seviye 7", time: "1 g önce", type: "warning" }
  ]

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-background text-foreground min-h-screen transition-colors">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          Hoş Geldiniz!
        </h1>
        <p className="text-muted-foreground max-w-prose">
          Hastane 4.0 yönetim paneline hoş geldiniz. Aşağıdaki modüllerden istediğinizi seçerek işlemlerinizi
          gerçekleştirebilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Ölçüm Tanımları" icon={<BarChart3 className="w-6 h-6" />}>
          <p className="text-sm text-muted-foreground mb-4">
            Ölçüm ve değerlendirme parametreleri
          </p>
          <MenuList items={measurementItems} />
        </Card>

        <Card title="Temel Tanımlar" icon={<Database className="w-6 h-6" />}>
          <p className="text-sm text-muted-foreground mb-4">
            Sistem temel tanımlarını yönetin
          </p>
          <MenuList items={basicItems} />
        </Card>

        <Card title="Son İşlemler" icon={<TrendingUp className="w-6 h-6" />}>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-muted rounded-lg"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === "success"
                      ? "bg-green-500"
                      : activity.type === "warning"
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {activity.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Sınıflandırma Tanımları" icon={<Users className="w-6 h-6" />}>
          <p className="text-sm text-muted-foreground mb-4">
            Sistem temel tanımlarını yönetin
          </p>
          <MenuList items={classificationItems} />
        </Card>

        <Card title="Atamalar" icon={<Settings className="w-6 h-6" />}>
          <p className="text-sm text-muted-foreground mb-4">
            Ölçüm ve değerlendirme parametreleri
          </p>
          <MenuList items={assignmentItems} />
        </Card>

        <Card title="Sistem Durumu" icon={<Activity className="w-6 h-6" />}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Veritabanı</span>
              <StatusBadge status="active" label="Aktif" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Servisleri</span>
              <StatusBadge status="error" label="Çalışmıyor" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Son Yedekleme</span>
              <span className="text-xs text-muted-foreground">2 saat önce</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
