// App.tsx
import { Routes, Route } from "react-router-dom"
import { Layout } from "./components/layout/Layout"
import { Dashboard } from "./pages/dashboard/Dashboard"
import Eslesme from "./pages/eslesme/Eslesme" 
import BoyutHome from "@/components/boyut/BoyutHome";
import KriterHome from "@/components/kriter/KriterHome";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/eslesme" element={<Eslesme />} /> {/* ✅ burası eklendi */}
        <Route path="/boyutlar" element={<BoyutHome />} />
        <Route path="/kriterler" element={<KriterHome />} />
        <Route path="/gostergeler" element={<div className="p-6">Göstergeler sayfası yakında...</div>} />
        <Route path="/diller" element={<div className="p-6">Diller sayfası yakında...</div>} />
        <Route path="/ulkeler" element={<div className="p-6">Ülkeler sayfası yakında...</div>} />
        <Route path="/sehirler" element={<div className="p-6">Şehirler sayfası yakında...</div>} />
        <Route path="/hastaneler" element={<div className="p-6">Hastaneler sayfası yakında...</div>} />
        <Route path="/kullanicilar" element={<div className="p-6">Kullanıcılar sayfası yakında...</div>} />
      </Routes>
    </Layout>
  )
}

export default App
