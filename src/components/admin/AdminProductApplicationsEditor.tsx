"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import AdminImageField from "@/components/admin/AdminImageField";
import AdminTranslateButton from "@/components/admin/AdminTranslateButton";

interface LocalizedText {
  en: string;
  vi: string;
}

export interface ProductApplicationDraft {
  image: string;
  order: number;
  subtitle: LocalizedText;
  title: LocalizedText;
}

interface AdminProductApplicationsEditorProps {
  items: ProductApplicationDraft[];
  onChange: (items: ProductApplicationDraft[]) => void;
  onError?: (message: string) => void;
}

function createEmptyApplication(order: number): ProductApplicationDraft {
  return {
    image: "",
    order,
    subtitle: { en: "", vi: "" },
    title: { en: "", vi: "" },
  };
}

function normalizeOrders(items: ProductApplicationDraft[]) {
  return items.map((item, index) => ({
    ...item,
    order: index,
  }));
}

function moveItem(
  items: ProductApplicationDraft[],
  fromIndex: number,
  toIndex: number
) {
  if (toIndex < 0 || toIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  const [target] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, target);
  return normalizeOrders(nextItems);
}

export default function AdminProductApplicationsEditor({
  items,
  onChange,
  onError,
}: AdminProductApplicationsEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 border border-outline-variant bg-surface px-4 py-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
            Ứng dụng sản phẩm
          </p>
          <p className="mt-1 font-body text-sm leading-6 text-on-surface-variant">
            Quản lý ảnh, tiêu đề và mô tả ngắn cho từng bối cảnh ứng dụng.
          </p>
        </div>

        <button
          className="inline-flex items-center gap-2 bg-primary px-4 py-3 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-secondary"
          onClick={() => onChange([...items, createEmptyApplication(items.length)])}
          type="button"
        >
          <Plus size={13} />
          Thêm ứng dụng
        </button>
      </div>

      {items.length === 0 ? (
        <div className="border border-dashed border-outline-variant/50 bg-surface-container-low px-6 py-10 text-center font-body text-sm text-on-surface-variant">
          Chưa có ứng dụng nào. Hãy thêm nếu sản phẩm cần phần này ở trang chi tiết.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <article
              key={`application-${index}`}
              className="border border-outline-variant/40 bg-white p-5"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">
                    Ứng dụng {index + 1}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    className="inline-flex items-center gap-2 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={index === 0}
                    onClick={() => onChange(moveItem(items, index, index - 1))}
                    type="button"
                  >
                    <ArrowUp size={13} />
                    Lên
                  </button>
                  <button
                    className="inline-flex items-center gap-2 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={index === items.length - 1}
                    onClick={() => onChange(moveItem(items, index, index + 1))}
                    type="button"
                  >
                    <ArrowDown size={13} />
                    Xuống
                  </button>
                  <button
                    className="inline-flex items-center gap-2 border border-red-200 px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-red-600 transition-colors hover:bg-red-50"
                    onClick={() =>
                      onChange(
                        normalizeOrders(
                          items.filter((_, currentIndex) => currentIndex !== index)
                        )
                      )
                    }
                    type="button"
                  >
                    <Trash2 size={13} />
                    Xóa
                  </button>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
                <AdminImageField
                  helperText="Có thể dán link ảnh hoặc tải file. Nếu link bắt đầu bằng `https://woodland.vn/`, hệ thống sẽ chuyển sang R2 khi lưu."
                  label="Ảnh ứng dụng"
                  onChange={(value) =>
                    onChange(
                      items.map((entry, currentIndex) =>
                        currentIndex === index ? { ...entry, image: value } : entry
                      )
                    )
                  }
                  value={item.image}
                />

                <div className="space-y-4">
                  <label className="block space-y-2">
                    <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                      Tiêu đề tiếng Việt
                    </span>
                    <input
                      className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                      onChange={(event) =>
                        onChange(
                          items.map((entry, currentIndex) =>
                            currentIndex === index
                              ? {
                                  ...entry,
                                  title: {
                                    ...entry.title,
                                    vi: event.target.value,
                                  },
                                }
                              : entry
                          )
                        )
                      }
                      value={item.title.vi}
                    />
                  </label>

                  <label className="block space-y-2">
                    <div className="flex items-end justify-between gap-3">
                      <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                        Tiêu đề tiếng Anh
                      </span>
                      <AdminTranslateButton
                        fieldLabel="tiêu đề ứng dụng sản phẩm"
                        onError={onError}
                        onTranslated={(value) =>
                          onChange(
                            items.map((entry, currentIndex) =>
                              currentIndex === index
                                ? {
                                    ...entry,
                                    title: {
                                      ...entry.title,
                                      en: value,
                                    },
                                  }
                                : entry
                            )
                          )
                        }
                        sourceValue={item.title.vi}
                      />
                    </div>
                    <input
                      className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                      onChange={(event) =>
                        onChange(
                          items.map((entry, currentIndex) =>
                            currentIndex === index
                              ? {
                                  ...entry,
                                  title: {
                                    ...entry.title,
                                    en: event.target.value,
                                  },
                                }
                              : entry
                          )
                        )
                      }
                      value={item.title.en}
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                      Mô tả ngắn tiếng Việt
                    </span>
                    <textarea
                      className="min-h-28 w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                      onChange={(event) =>
                        onChange(
                          items.map((entry, currentIndex) =>
                            currentIndex === index
                              ? {
                                  ...entry,
                                  subtitle: {
                                    ...entry.subtitle,
                                    vi: event.target.value,
                                  },
                                }
                              : entry
                          )
                        )
                      }
                      value={item.subtitle.vi}
                    />
                  </label>

                  <label className="block space-y-2">
                    <div className="flex items-end justify-between gap-3">
                      <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                        Mô tả ngắn tiếng Anh
                      </span>
                      <AdminTranslateButton
                        fieldLabel="mô tả ứng dụng sản phẩm"
                        onError={onError}
                        onTranslated={(value) =>
                          onChange(
                            items.map((entry, currentIndex) =>
                              currentIndex === index
                                ? {
                                    ...entry,
                                    subtitle: {
                                      ...entry.subtitle,
                                      en: value,
                                    },
                                  }
                                : entry
                            )
                          )
                        }
                        sourceValue={item.subtitle.vi}
                      />
                    </div>
                    <textarea
                      className="min-h-28 w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                      onChange={(event) =>
                        onChange(
                          items.map((entry, currentIndex) =>
                            currentIndex === index
                              ? {
                                  ...entry,
                                  subtitle: {
                                    ...entry.subtitle,
                                    en: event.target.value,
                                  },
                                }
                              : entry
                          )
                        )
                      }
                      value={item.subtitle.en}
                    />
                  </label>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
