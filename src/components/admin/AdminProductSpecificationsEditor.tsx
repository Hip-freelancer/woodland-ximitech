"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import AdminTranslateButton from "@/components/admin/AdminTranslateButton";

interface LocalizedText {
  en: string;
  vi: string;
}

export interface ProductSpecificationDraft {
  attribute: LocalizedText;
  specification: LocalizedText;
  standard: string;
  tolerance: string;
}

interface AdminProductSpecificationsEditorProps {
  items: ProductSpecificationDraft[];
  onChange: (items: ProductSpecificationDraft[]) => void;
  onError?: (message: string) => void;
}

function createEmptySpecification(): ProductSpecificationDraft {
  return {
    attribute: { en: "", vi: "" },
    specification: { en: "", vi: "" },
    standard: "",
    tolerance: "",
  };
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  if (toIndex < 0 || toIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  const [target] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, target);
  return nextItems;
}

export default function AdminProductSpecificationsEditor({
  items,
  onChange,
  onError,
}: AdminProductSpecificationsEditorProps) {
  const specifications = items.length > 0 ? items : [createEmptySpecification()];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 border border-outline-variant bg-surface px-4 py-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
            Thông số kỹ thuật
          </p>
          <p className="mt-1 font-body text-sm leading-6 text-on-surface-variant">
            Nhập từng dòng thông số theo cấu trúc `thuộc tính`, `quy cách`,
            `dung sai`, `tiêu chuẩn`.
          </p>
        </div>

        <button
          className="inline-flex items-center gap-2 bg-primary px-4 py-3 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-secondary"
          onClick={() => onChange([...items, createEmptySpecification()])}
          type="button"
        >
          <Plus size={13} />
          Thêm dòng thông số
        </button>
      </div>

      <div className="space-y-4">
        {specifications.map((item, index) => (
          <article
            key={`specification-${index}`}
            className="border border-outline-variant/40 bg-white p-5"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">
                  Dòng {index + 1}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  className="inline-flex items-center gap-2 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={index === 0}
                  onClick={() => onChange(moveItem(specifications, index, index - 1))}
                  type="button"
                >
                  <ArrowUp size={13} />
                  Lên
                </button>
                <button
                  className="inline-flex items-center gap-2 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={index === specifications.length - 1}
                  onClick={() => onChange(moveItem(specifications, index, index + 1))}
                  type="button"
                >
                  <ArrowDown size={13} />
                  Xuống
                </button>
                <button
                  className="inline-flex items-center gap-2 border border-red-200 px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-red-600 transition-colors hover:bg-red-50"
                  onClick={() =>
                    onChange(
                      specifications.length === 1
                        ? []
                        : specifications.filter((_, currentIndex) => currentIndex !== index)
                    )
                  }
                  type="button"
                >
                  <Trash2 size={13} />
                  Xóa
                </button>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Thuộc tính tiếng Việt
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    onChange(
                      specifications.map((entry, currentIndex) =>
                        currentIndex === index
                          ? {
                              ...entry,
                              attribute: {
                                ...entry.attribute,
                                vi: event.target.value,
                              },
                            }
                          : entry
                      )
                    )
                  }
                  value={item.attribute.vi}
                />
              </label>

              <label className="block space-y-2">
                <div className="flex items-end justify-between gap-3">
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Thuộc tính tiếng Anh
                  </span>
                  <AdminTranslateButton
                    fieldLabel="thuộc tính thông số"
                    onError={onError}
                    onTranslated={(value) =>
                      onChange(
                        specifications.map((entry, currentIndex) =>
                          currentIndex === index
                            ? {
                                ...entry,
                                attribute: {
                                  ...entry.attribute,
                                  en: value,
                                },
                              }
                            : entry
                        )
                      )
                    }
                    sourceValue={item.attribute.vi}
                  />
                </div>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    onChange(
                      specifications.map((entry, currentIndex) =>
                        currentIndex === index
                          ? {
                              ...entry,
                              attribute: {
                                ...entry.attribute,
                                en: event.target.value,
                              },
                            }
                          : entry
                      )
                    )
                  }
                  value={item.attribute.en}
                />
              </label>

              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Quy cách tiếng Việt
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    onChange(
                      specifications.map((entry, currentIndex) =>
                        currentIndex === index
                          ? {
                              ...entry,
                              specification: {
                                ...entry.specification,
                                vi: event.target.value,
                              },
                            }
                          : entry
                      )
                    )
                  }
                  value={item.specification.vi}
                />
              </label>

              <label className="block space-y-2">
                <div className="flex items-end justify-between gap-3">
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Quy cách tiếng Anh
                  </span>
                  <AdminTranslateButton
                    fieldLabel="quy cách thông số"
                    onError={onError}
                    onTranslated={(value) =>
                      onChange(
                        specifications.map((entry, currentIndex) =>
                          currentIndex === index
                            ? {
                                ...entry,
                                specification: {
                                  ...entry.specification,
                                  en: value,
                                },
                              }
                            : entry
                        )
                      )
                    }
                    sourceValue={item.specification.vi}
                  />
                </div>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    onChange(
                      specifications.map((entry, currentIndex) =>
                        currentIndex === index
                          ? {
                              ...entry,
                              specification: {
                                ...entry.specification,
                                en: event.target.value,
                              },
                            }
                          : entry
                      )
                    )
                  }
                  value={item.specification.en}
                />
              </label>

              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Dung sai
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    onChange(
                      specifications.map((entry, currentIndex) =>
                        currentIndex === index
                          ? { ...entry, tolerance: event.target.value }
                          : entry
                      )
                    )
                  }
                  value={item.tolerance}
                />
              </label>

              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Tiêu chuẩn
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    onChange(
                      specifications.map((entry, currentIndex) =>
                        currentIndex === index
                          ? { ...entry, standard: event.target.value }
                          : entry
                      )
                    )
                  }
                  value={item.standard}
                />
              </label>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
