"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

import { generateAdminSeo } from "@/lib/adminClient";

interface AdminAutoSeoButtonProps {
  module: string;
  payload: Record<string, unknown>;
  onGenerated: (result: {
    seo?: {
      vi?: { title?: string; description?: string; keywords?: string[] };
      en?: { title?: string; description?: string; keywords?: string[] };
    };
    excerpt?: { vi?: string; en?: string };
  }) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
}

function hasMeaningfulPayload(payload: Record<string, unknown>) {
  try {
    return JSON.stringify(payload).replace(/[\s{}[\]",:]/g, "").length > 0;
  } catch {
    return false;
  }
}

export default function AdminAutoSeoButton({
  module,
  payload,
  onGenerated,
  onError,
  disabled = false,
}: AdminAutoSeoButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const canGenerate = useMemo(() => {
    return !disabled && !isLoading && hasMeaningfulPayload(payload);
  }, [disabled, isLoading, payload]);

  const handleGenerate = async () => {
    if (!canGenerate) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await generateAdminSeo({ module, payload });
      onGenerated(result);
    } catch (error) {
      onError?.(
        error instanceof Error
          ? error.message
          : "Không thể tạo SEO tự động bằng AI."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="inline-flex items-center gap-2 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-50"
      disabled={!canGenerate}
      onClick={handleGenerate}
      type="button"
    >
      <Sparkles size={13} />
      {isLoading ? "Đang tạo SEO..." : "Tạo SEO tự động"}
    </button>
  );
}

