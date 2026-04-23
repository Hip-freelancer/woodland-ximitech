"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Film, Link as LinkIcon, Trash2, Upload } from "lucide-react";
import AdminNotice from "@/components/admin/AdminNotice";
import { uploadAdminHeroVideo } from "@/lib/adminClient";

interface AdminVideoFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
}

export default function AdminVideoField({
  label,
  value,
  onChange,
  helperText,
}: AdminVideoFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePickFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setErrorMessage("");
    setIsUploading(true);

    try {
      const uploadedUrl = await uploadAdminHeroVideo(file, value);
      onChange(uploadedUrl);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Không thể tải video hero lên."
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
          {label}
        </span>
        <button
          className="inline-flex items-center gap-2 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isUploading}
          onClick={handlePickFile}
          type="button"
        >
          <Upload size={13} />
          {isUploading ? "Đang nén..." : "Tải video"}
        </button>
      </div>

      <label className="block space-y-2">
        <span className="inline-flex items-center gap-2 font-body text-xs text-on-surface-variant">
          <LinkIcon size={13} />
          Dán liên kết video hoặc tải file từ máy
        </span>
        <input
          className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://... hoặc /uploads/hero-media/..."
          type="text"
          value={value}
        />
      </label>

      <input
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
        ref={inputRef}
        type="file"
      />

      {helperText ? (
        <p className="font-body text-xs leading-6 text-on-surface-variant">
          {helperText}
        </p>
      ) : null}

      {errorMessage ? <AdminNotice message={errorMessage} tone="error" /> : null}

      <div className="overflow-hidden border border-dashed border-outline-variant/60 bg-surface">
        {value ? (
          <div className="space-y-3 p-3">
            <div className="h-56 overflow-hidden bg-surface-container">
              <video
                className="h-full w-full object-cover"
                controls
                muted
                playsInline
                preload="metadata"
                src={value}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="truncate font-body text-xs text-on-surface-variant">
                {value}
              </p>
              <button
                className="inline-flex items-center gap-2 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-red-500 hover:text-red-600"
                onClick={() => onChange("")}
                type="button"
              >
                <Trash2 size={13} />
                Xóa video
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-56 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-on-surface-variant">
              <Film size={20} />
            </span>
            <div>
              <p className="font-body text-sm font-semibold text-on-surface">
                Chưa có video
              </p>
              <p className="mt-1 font-body text-xs leading-6 text-on-surface-variant">
                Video tải lên sẽ được nén tự động trước khi lưu vào codebase.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
