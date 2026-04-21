"use client";

import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Plus, Star, Trash2, Upload } from "lucide-react";
import AdminNotice from "@/components/admin/AdminNotice";
import { uploadAdminImage } from "@/lib/adminClient";

interface AdminGalleryFieldProps {
  label: string;
  values: string[];
  onChange: (value: string[]) => void;
}

function moveItem(values: string[], fromIndex: number, toIndex: number) {
  if (toIndex < 0 || toIndex >= values.length) {
    return values;
  }

  const nextValues = [...values];
  const [item] = nextValues.splice(fromIndex, 1);
  nextValues.splice(toIndex, 0, item);
  return nextValues;
}

function appendUnique(values: string[], nextValues: string[]) {
  const existing = new Set(values);
  const uniqueValues = nextValues.filter((item) => item && !existing.has(item));
  return [...values, ...uniqueValues];
}

export default function AdminGalleryField({
  label,
  values,
  onChange,
}: AdminGalleryFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingLink, setPendingLink] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddLink = () => {
    const nextLink = pendingLink.trim();

    if (!nextLink) {
      setErrorMessage("Vui lòng nhập liên kết ảnh trước khi thêm.");
      return;
    }

    setErrorMessage("");
    onChange(appendUnique(values, [nextLink]));
    setPendingLink("");
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    setErrorMessage("");
    setIsUploading(true);

    try {
      const uploadedUrls = await Promise.all(
        files.map((file) => uploadAdminImage(file))
      );
      onChange(appendUnique(values, uploadedUrls));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Không thể tải ảnh lên."
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
            {label}
          </p>
          <p className="mt-1 font-body text-xs leading-6 text-on-surface-variant">
            Có thể thêm ảnh bằng link hoặc tải file. Ảnh đầu tiên luôn là ảnh chính.
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <Upload size={13} />
          {isUploading ? "Đang tải..." : "Tải nhiều ảnh"}
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <input
          className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
          onChange={(event) => setPendingLink(event.target.value)}
          placeholder="https://..."
          type="url"
          value={pendingLink}
        />
        <button
          className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-3 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-secondary"
          onClick={handleAddLink}
          type="button"
        >
          <Plus size={13} />
          Thêm link ảnh
        </button>
      </div>

      <input
        accept="image/*"
        className="hidden"
        multiple
        onChange={handleFileChange}
        ref={inputRef}
        type="file"
      />

      {errorMessage ? <AdminNotice message={errorMessage} tone="error" /> : null}

      {values.length === 0 ? (
        <div className="flex h-56 flex-col items-center justify-center gap-3 border border-dashed border-outline-variant/60 bg-surface px-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-on-surface-variant">
            <ImagePlus size={20} />
          </span>
          <div>
            <p className="font-body text-sm font-semibold text-on-surface">
              Chưa có ảnh sản phẩm
            </p>
            <p className="mt-1 font-body text-xs leading-6 text-on-surface-variant">
              Hãy tải file hoặc thêm link. Ảnh đầu tiên sẽ được dùng làm ảnh đại diện.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {values.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="overflow-hidden border border-outline-variant/50 bg-white"
            >
              <div className="relative h-44 overflow-hidden bg-surface-container">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={`Ảnh sản phẩm ${index + 1}`}
                  className="h-full w-full object-cover"
                  src={image}
                />
                {index === 0 ? (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 bg-primary px-2 py-1 font-label text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                    <Star size={11} />
                    Ảnh chính
                  </span>
                ) : null}
              </div>
              <div className="space-y-3 p-4">
                <p className="truncate font-body text-xs text-on-surface-variant">
                  {image}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    className="inline-flex items-center justify-center gap-1 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={index === 0}
                    onClick={() => onChange(moveItem(values, index, index - 1))}
                    type="button"
                  >
                    <ArrowUp size={12} />
                    Lên
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-1 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={index === values.length - 1}
                    onClick={() => onChange(moveItem(values, index, index + 1))}
                    type="button"
                  >
                    <ArrowDown size={12} />
                    Xuống
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-1 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant transition-colors hover:border-red-500 hover:text-red-600"
                    onClick={() =>
                      onChange(values.filter((_, currentIndex) => currentIndex !== index))
                    }
                    type="button"
                  >
                    <Trash2 size={12} />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
