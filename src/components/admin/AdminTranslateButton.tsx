"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import { translateAdminContent } from "@/lib/adminClient";

interface AdminTranslateButtonProps {
  sourceValue: string;
  fieldLabel: string;
  onTranslated: (value: string) => void;
  onError?: (message: string) => void;
  preserveHtml?: boolean;
  disabled?: boolean;
}

function hasTranslatableContent(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .trim().length > 0;
}

export default function AdminTranslateButton({
  sourceValue,
  fieldLabel,
  onTranslated,
  onError,
  preserveHtml = false,
  disabled = false,
}: AdminTranslateButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const canTranslate =
    !disabled && !isLoading && hasTranslatableContent(sourceValue);

  const handleTranslate = async () => {
    if (!canTranslate) {
      return;
    }

    setIsLoading(true);

    try {
      const translatedValue = await translateAdminContent({
        content: sourceValue,
        fieldLabel,
        preserveHtml,
      });

      onTranslated(translatedValue);
    } catch (error) {
      onError?.(
        error instanceof Error ? error.message : "Không thể dịch nội dung bằng AI."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="inline-flex items-center gap-2 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-50"
      disabled={!canTranslate}
      onClick={handleTranslate}
      type="button"
    >
      <Languages size={13} />
      {isLoading ? "Đang dịch..." : "Dịch AI sang tiếng Anh"}
    </button>
  );
}
