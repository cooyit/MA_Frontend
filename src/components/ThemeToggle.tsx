// src/components/ThemeToggle.tsx

import { useTheme } from "@/theme/ThemeProvider";
import { Sun, Moon} from "lucide-react";
export default function ThemeToggle() {
  const {  setTheme, isDark } = useTheme();
  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
        title="Temayı değiştir"
      >
        {isDark ? <Sun /> : <Moon />}
      </button>
      
    </div>
  );
}