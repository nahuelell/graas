"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { Spec } from "@/lib/types";
import { inputCls } from "./ui";

const SUGGESTIONS = ["Largo", "Ancho", "Alto", "Alto baranda", "Chasis", "Material", "Terminación", "Incluye"];

/** Lista editable de características (Largo: 5,40 m, etc.). */
export function SpecsEditor({ name, initial = [] }: { name: string; initial?: Spec[] }) {
  const [rows, setRows] = useState<Spec[]>(initial.length ? initial : [{ label: "", value: "" }]);
  const update = (i: number, key: keyof Spec, v: string) => setRows((r) => r.map((row, k) => (k === i ? { ...row, [key]: v } : row)));

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={JSON.stringify(rows)} />
      <datalist id={`${name}-labels`}>
        {SUGGESTIONS.map((s) => <option key={s} value={s} />)}
      </datalist>
      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-[1fr_1.4fr_auto] gap-2">
          <input list={`${name}-labels`} value={row.label} onChange={(e) => update(i, "label", e.target.value)} placeholder="Ej: Largo" className={inputCls} />
          <input value={row.value} onChange={(e) => update(i, "value", e.target.value)} placeholder="Ej: 5,40 m" className={inputCls} />
          <button type="button" onClick={() => setRows((r) => r.filter((_, k) => k !== i))} className="grid size-11 place-items-center rounded-xl border border-line text-dim hover:border-red-400 hover:text-red-300" aria-label="Quitar">
            <X className="size-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => setRows((r) => [...r, { label: "", value: "" }])} className="flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
        <Plus className="size-4" /> Agregar característica
      </button>
    </div>
  );
}
