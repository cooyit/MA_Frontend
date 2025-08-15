// src/lib/useEditable.ts
import { useState } from "react";

export function useEditable(initial = false) {
  const [editMode, setEditMode] = useState<boolean>(initial);
  const enterEdit = () => setEditMode(true);
  const exitEdit = () => setEditMode(false);
  return { editMode, enterEdit, exitEdit, setEditMode };
}
