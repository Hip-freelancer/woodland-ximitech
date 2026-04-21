"use client";

import { Save } from "lucide-react";

interface AdminPriorityInputProps {
  isDirty: boolean;
  isSaving: boolean;
  onChange: (value: number) => void;
  onSave: () => void;
  value: number;
}

export default function AdminPriorityInput({
  isDirty,
  isSaving,
  onChange,
  onSave,
  value,
}: AdminPriorityInputProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        className="w-20 border border-outline-variant bg-surface px-3 py-2 font-body text-sm text-on-surface outline-none transition-colors focus:border-secondary"
        min={0}
        onChange={(event) => onChange(Math.max(0, Number(event.target.value) || 0))}
        type="number"
        value={value}
      />
      <button
        className="inline-flex items-center gap-1.5 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:border-outline-variant/50 disabled:text-outline"
        disabled={!isDirty || isSaving}
        onClick={onSave}
        type="button"
      >
        <Save size={12} />
        {isSaving ? "Đang lưu" : "Save"}
      </button>
    </div>
  );
}
