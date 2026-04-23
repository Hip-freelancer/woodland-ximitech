"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  FolderOpen,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import AdminAutoSeoButton from "@/components/admin/AdminAutoSeoButton";
import AdminImageField from "@/components/admin/AdminImageField";
import AdminNotice from "@/components/admin/AdminNotice";
import AdminPriorityInput from "@/components/admin/AdminPriorityInput";
import AdminTranslateButton from "@/components/admin/AdminTranslateButton";
import { formatAdminDate, readAdminApiError } from "@/lib/adminClient";
import {
  getNextPrioritySortMode,
  sortAdminList,
  type AdminListSortMode,
} from "@/lib/adminListSort";
import { createSlug } from "@/lib/slug";
import {
  normalizeCategoryContentType,
  type CategoryContentType,
} from "@/lib/category";

interface LocalizedText {
  en: string;
  vi: string;
}

interface SeoFields {
  title: string;
  description: string;
  keywords: string;
}

interface AdminCategory {
  _id: string;
  contentType?: CategoryContentType;
  createdAt: string;
  image: string;
  isVisible: boolean;
  name: LocalizedText;
  priority: number;
  seo: SeoFields;
  slug: string;
  updatedAt: string;
}

interface CategoryFormState {
  contentType: CategoryContentType;
  image: string;
  isVisible: boolean;
  name: LocalizedText;
  priority: number;
  seo: SeoFields;
  slug: string;
}

interface NoticeState {
  message: string;
  tone: "error" | "success" | "warning";
}

const CONTENT_TYPE_OPTIONS: Array<{
  description: string;
  label: string;
  value: CategoryContentType;
}> = [
  {
    description: "Dùng cho sản phẩm, menu thư viện và bộ lọc catalog.",
    label: "Danh mục sản phẩm",
    value: "product",
  },
  {
    description: "Dùng cho chuyên mục bài viết và trang tin tức.",
    label: "Danh mục bài viết",
    value: "news",
  },
];

function createEmptyForm(
  contentType: CategoryContentType = "product"
): CategoryFormState {
  return {
    contentType,
    image: "",
    isVisible: true,
    name: { en: "", vi: "" },
    priority: 0,
    seo: { title: "", description: "", keywords: "" },
    slug: "",
  };
}

function resolveCategorySlug(name: LocalizedText) {
  return createSlug(name.vi || name.en);
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [activeContentType, setActiveContentType] =
    useState<CategoryContentType>("product");
  const [formData, setFormData] = useState<CategoryFormState>(() =>
    createEmptyForm("product")
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [priorityDrafts, setPriorityDrafts] = useState<Record<string, number>>(
    {}
  );
  const [savingPriorityId, setSavingPriorityId] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<AdminListSortMode>("created-desc");

  const showErrorNotice = (message: string) => {
    setNotice({ message, tone: "error" });
  };

  const normalizedCategories = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        contentType: normalizeCategoryContentType(category.contentType),
      })),
    [categories]
  );

  const visibleCategories = useMemo(
    () =>
      sortAdminList(
        normalizedCategories.filter(
          (category) => category.contentType === activeContentType
        ),
        sortMode
      ),
    [activeContentType, normalizedCategories, sortMode]
  );

  const applyAutoSeo = (result: {
    seo?: {
      vi?: { title?: string; description?: string; keywords?: string[] };
      en?: { title?: string; description?: string; keywords?: string[] };
    };
  }) => {
    const seoVi = result.seo?.vi;

    if (!seoVi) {
      showErrorNotice("AI không trả về SEO tiếng Việt hợp lệ.");
      return;
    }

    setFormData((current) => ({
      ...current,
      seo: {
        title: seoVi.title ?? current.seo.title,
        description: seoVi.description ?? current.seo.description,
        keywords: Array.isArray(seoVi.keywords)
          ? seoVi.keywords.join(", ")
          : current.seo.keywords,
      },
    }));
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchCategories(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function fetchCategories(showLoading = true) {
    if (showLoading) {
      setIsLoading(true);
    }

    try {
      const response = await fetch("/api/admin/categories");

      if (!response.ok) {
        throw new Error(
          await readAdminApiError(response, "Không thể tải danh mục.")
        );
      }

      const data = (await response.json()) as AdminCategory[];
      setCategories(data);
    } catch (error) {
      setNotice({
        message:
          error instanceof Error ? error.message : "Không thể tải danh mục.",
        tone: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const resetEditor = () => {
    setEditingId(null);
    setFormData(createEmptyForm(activeContentType));
    setIsEditorOpen(false);
  };

  const openCreateEditor = () => {
    setNotice(null);
    setEditingId(null);
    setFormData(createEmptyForm(activeContentType));
    setIsEditorOpen(true);
  };

  const openEditEditor = (category: AdminCategory) => {
    const contentType = normalizeCategoryContentType(category.contentType);

    setNotice(null);
    setEditingId(category._id);
    setActiveContentType(contentType);
    setFormData({
      contentType,
      image: category.image ?? "",
      isVisible: category.isVisible ?? true,
      name: {
        en: category.name?.en ?? "",
        vi: category.name?.vi ?? "",
      },
      priority: category.priority ?? 0,
      seo: {
        description: category.seo?.description ?? "",
        keywords: category.seo?.keywords ?? "",
        title: category.seo?.title ?? "",
      },
      slug: category.slug ?? "",
    });
    setIsEditorOpen(true);
  };

  const updateCategoryName = (locale: keyof LocalizedText, value: string) => {
    setFormData((current) => {
      const nextName = { ...current.name, [locale]: value };
      return {
        ...current,
        name: nextName,
        slug: resolveCategorySlug(nextName),
      };
    });
  };

  const saveCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setNotice(null);

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `/api/admin/categories/${editingId}`
      : "/api/admin/categories";

    try {
      const response = await fetch(url, {
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
        method,
      });

      if (!response.ok) {
        throw new Error(
          await readAdminApiError(response, "Không thể lưu danh mục.")
        );
      }

      await fetchCategories();
      resetEditor();
      setNotice({
        message: editingId
          ? "Đã cập nhật danh mục."
          : "Đã tạo danh mục mới.",
        tone: "success",
      });
    } catch (error) {
      setNotice({
        message:
          error instanceof Error ? error.message : "Không thể lưu danh mục.",
        tone: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateCategory = async (
    categoryId: string,
    payload: Partial<CategoryFormState>,
    successMessage: string
  ) => {
    setNotice(null);

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error(
          await readAdminApiError(response, "Không thể cập nhật danh mục.")
        );
      }

      await fetchCategories();
      setNotice({ message: successMessage, tone: "success" });
      return true;
    } catch (error) {
      setNotice({
        message:
          error instanceof Error
            ? error.message
            : "Không thể cập nhật danh mục.",
        tone: "error",
      });
      return false;
    }
  };

  const deleteCategory = async (category: AdminCategory) => {
    const confirmMessage =
      category.contentType === "news"
        ? "Xóa danh mục bài viết này khỏi hệ thống?"
        : "Xóa danh mục sản phẩm này khỏi hệ thống?";

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setNotice(null);

    try {
      const response = await fetch(`/api/admin/categories/${category._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          await readAdminApiError(response, "Không thể xóa danh mục.")
        );
      }

      await fetchCategories();
      setNotice({ message: "Đã xóa danh mục.", tone: "success" });
    } catch (error) {
      setNotice({
        message:
          error instanceof Error ? error.message : "Không thể xóa danh mục.",
        tone: "error",
      });
    }
  };

  const getPriorityValue = (category: AdminCategory) =>
    priorityDrafts[category._id] ?? category.priority ?? 0;

  const isPriorityDirty = (category: AdminCategory) =>
    getPriorityValue(category) !== (category.priority ?? 0);

  const savePriority = async (category: AdminCategory) => {
    const nextPriority = getPriorityValue(category);

    if (nextPriority === (category.priority ?? 0)) {
      return;
    }

    setSavingPriorityId(category._id);

    const success = await updateCategory(
      category._id,
      { priority: nextPriority },
      "Đã lưu thứ tự ưu tiên danh mục."
    );

    setSavingPriorityId(null);

    if (success) {
      setPriorityDrafts((current) => {
        const nextDrafts = { ...current };
        delete nextDrafts[category._id];
        return nextDrafts;
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border border-outline-variant/40 bg-white p-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">
            Cấu trúc nội dung
          </p>
          <div className="flex items-start gap-4">
            <span className="mt-1 flex h-12 w-12 items-center justify-center bg-primary-fixed text-primary">
              <FolderOpen size={22} />
            </span>
            <div>
              <h1 className="font-headline text-3xl font-black uppercase tracking-tight text-primary">
                Danh mục
              </h1>
              <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-on-surface-variant">
                Quản lý riêng danh mục sản phẩm và danh mục bài viết. Slug sẽ là
                khóa dùng cho filter, menu và map dữ liệu public.
              </p>
            </div>
          </div>
        </div>

        <button
          className="inline-flex items-center justify-center gap-2 bg-primary px-5 py-4 font-label text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-secondary"
          onClick={openCreateEditor}
          type="button"
        >
          <Plus size={15} />
          Thêm danh mục
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {CONTENT_TYPE_OPTIONS.map((option) => {
          const isActive = option.value === activeContentType;
          const count = normalizedCategories.filter(
            (category) => category.contentType === option.value
          ).length;

          return (
            <button
              key={option.value}
              className={`border px-5 py-5 text-left transition-colors ${
                isActive
                  ? "border-primary bg-primary text-white"
                  : "border-outline-variant/40 bg-white hover:border-secondary"
              }`}
              onClick={() => {
                setActiveContentType(option.value);
                if (!editingId) {
                  setFormData(createEmptyForm(option.value));
                }
              }}
              type="button"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p
                    className={`font-label text-[10px] font-semibold uppercase tracking-[0.18em] ${
                      isActive ? "text-white/72" : "text-secondary"
                    }`}
                  >
                    {option.label}
                  </p>
                  <p
                    className={`mt-2 font-body text-sm leading-6 ${
                      isActive ? "text-white/82" : "text-on-surface-variant"
                    }`}
                  >
                    {option.description}
                  </p>
                </div>
                <span
                  className={`font-headline text-3xl font-black ${
                    isActive ? "text-white" : "text-primary"
                  }`}
                >
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {notice ? <AdminNotice message={notice.message} tone={notice.tone} /> : null}

      {isEditorOpen ? (
        <div className="border border-outline-variant/40 bg-white p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-headline text-2xl font-black uppercase tracking-tight text-primary">
                {editingId ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
              </h2>
              <p className="mt-2 font-body text-sm text-on-surface-variant">
                Slug được sinh tự động từ tên tiếng Việt, nếu trống sẽ dùng tên
                tiếng Anh.
              </p>
            </div>

            <button
              className="inline-flex items-center gap-2 border border-outline-variant px-4 py-3 font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary"
              onClick={resetEditor}
              type="button"
            >
              <X size={14} />
              Đóng form
            </button>
          </div>

          <form className="space-y-6" onSubmit={saveCategory}>
            <div className="grid gap-4 md:grid-cols-2">
              {CONTENT_TYPE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-start gap-3 border px-4 py-4 transition-colors ${
                    formData.contentType === option.value
                      ? "border-primary/25 bg-primary/7"
                      : "border-outline-variant/40 bg-surface hover:border-primary/35"
                  }`}
                >
                  <input
                    checked={formData.contentType === option.value}
                    className="mt-1 h-4 w-4 accent-primary"
                    name="contentType"
                    onChange={() =>
                      setFormData((current) => ({
                        ...current,
                        contentType: option.value,
                      }))
                    }
                    type="radio"
                  />
                  <span>
                    <span className="block font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface">
                      {option.label}
                    </span>
                    <span className="mt-1 block font-body text-sm leading-6 text-on-surface-variant">
                      {option.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            <div className="grid items-end gap-4 lg:grid-cols-2">
              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Tên danh mục tiếng Việt
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) => updateCategoryName("vi", event.target.value)}
                  required
                  value={formData.name.vi}
                />
              </label>

              <label className="block space-y-2">
                <div className="flex items-end justify-between gap-3">
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Tên danh mục tiếng Anh
                  </span>
                  <AdminTranslateButton
                    fieldLabel="tên danh mục"
                    onError={showErrorNotice}
                    onTranslated={(value) =>
                      setFormData((current) => ({
                        ...current,
                        name: { ...current.name, en: value },
                      }))
                    }
                    sourceValue={formData.name.vi}
                  />
                </div>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) => updateCategoryName("en", event.target.value)}
                  required
                  value={formData.name.en}
                />
              </label>
            </div>

            <div className="grid items-end gap-4 lg:grid-cols-[1.4fr_0.6fr_0.6fr]">
              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Slug tự sinh
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm text-on-surface-variant outline-none"
                  readOnly
                  value={formData.slug}
                />
              </label>

              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Ưu tiên
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  min={0}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      priority: Number(event.target.value) || 0,
                    }))
                  }
                  type="number"
                  value={formData.priority}
                />
              </label>

              <label className="flex items-center gap-3 border border-outline-variant bg-surface px-4 py-3">
                <input
                  checked={formData.isVisible}
                  className="h-4 w-4 accent-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      isVisible: event.target.checked,
                    }))
                  }
                  type="checkbox"
                />
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Hiển thị
                </span>
              </label>
            </div>

            <AdminImageField
              helperText="Có thể nhập link ảnh hoặc tải file từ máy. Nếu dùng link `https://woodland.vn/`, hệ thống sẽ tự tải lại lên R2 khi lưu."
              label="Ảnh danh mục"
              onChange={(value) =>
                setFormData((current) => ({
                  ...current,
                  image: value,
                }))
              }
              value={formData.image}
            />

            <div className="space-y-4">
              <div className="flex flex-col gap-3 border border-outline-variant bg-surface px-4 py-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    SEO
                  </p>
                  <p className="mt-1 font-body text-sm text-on-surface-variant">
                    AI sẽ tạo SEO song ngữ, và form sẽ tự điền theo bản tiếng Việt.
                  </p>
                </div>

                <AdminAutoSeoButton
                  module="category"
                  onError={showErrorNotice}
                  onGenerated={applyAutoSeo}
                  payload={{
                    contentType: formData.contentType,
                    name: formData.name,
                    slug: formData.slug,
                  }}
                />
              </div>

              <div className="grid items-end gap-4 lg:grid-cols-3">
                <label className="block space-y-2">
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Tiêu đề SEO
                  </span>
                  <input
                    className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        seo: { ...current.seo, title: event.target.value },
                      }))
                    }
                    value={formData.seo.title}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Mô tả SEO
                  </span>
                  <input
                    className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        seo: { ...current.seo, description: event.target.value },
                      }))
                    }
                    value={formData.seo.description}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Từ khóa SEO
                  </span>
                  <input
                    className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        seo: { ...current.seo, keywords: event.target.value },
                      }))
                    }
                    value={formData.seo.keywords}
                  />
                </label>
              </div>
            </div>

            <button
              className="inline-flex items-center gap-2 bg-primary px-5 py-4 font-label text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:bg-primary/60"
              disabled={isSaving}
              type="submit"
            >
              <Save size={15} />
              {isSaving ? "Đang lưu..." : editingId ? "Lưu thay đổi" : "Tạo danh mục"}
            </button>
          </form>
        </div>
      ) : null}

      <div className="overflow-hidden border border-outline-variant/40 bg-white">
        <div className="flex flex-col gap-3 border-b border-outline-variant/40 bg-surface-container-low/40 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">
              {activeContentType === "product"
                ? "Danh mục sản phẩm"
                : "Danh mục bài viết"}
            </p>
            <p className="font-body text-xs text-on-surface-variant">
              FE đang ưu tiên hiển thị theo số nhỏ đến lớn. Ví dụ: 0 sẽ đứng
              trước 1.
            </p>
          </div>

          <button
            className="inline-flex w-fit items-center gap-2 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary"
            onClick={() => setSortMode("created-desc")}
            type="button"
          >
            Mới nhất
          </button>
        </div>

        <table className="min-w-full divide-y divide-outline-variant/40">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-6 py-4 text-left font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                Danh mục
              </th>
              <th className="px-6 py-4 text-left font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                Slug
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  className="inline-flex items-center gap-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:text-secondary"
                  onClick={() =>
                    setSortMode((current) => getNextPrioritySortMode(current))
                  }
                  type="button"
                >
                  Ưu tiên
                  {sortMode === "priority-asc" ? (
                    <ArrowUp size={14} />
                  ) : sortMode === "priority-desc" ? (
                    <ArrowDown size={14} />
                  ) : null}
                </button>
              </th>
              <th className="px-6 py-4 text-left font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                Hiển thị
              </th>
              <th className="px-6 py-4 text-left font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                Cập nhật
              </th>
              <th className="px-6 py-4 text-left font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {isLoading ? (
              <tr>
                <td
                  className="px-6 py-10 text-center font-body text-sm text-on-surface-variant"
                  colSpan={6}
                >
                  Đang tải danh mục...
                </td>
              </tr>
            ) : null}

            {!isLoading && visibleCategories.length === 0 ? (
              <tr>
                <td
                  className="px-6 py-10 text-center font-body text-sm text-on-surface-variant"
                  colSpan={6}
                >
                  {activeContentType === "product"
                    ? "Chưa có danh mục sản phẩm nào."
                    : "Chưa có danh mục bài viết nào."}
                </td>
              </tr>
            ) : null}

            {!isLoading
              ? visibleCategories.map((category) => (
                  <tr
                    key={category._id}
                    className="hover:bg-surface-container-low/60"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 shrink-0 overflow-hidden bg-surface-container">
                          {category.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              alt={category.name?.vi || category.slug}
                              className="h-full w-full object-cover"
                              src={category.image}
                            />
                          ) : null}
                        </div>
                        <div>
                          <div className="font-body text-sm font-semibold text-on-surface">
                            {category.name?.vi || "Chưa đặt tên"}
                          </div>
                          <div className="mt-1 font-body text-xs text-on-surface-variant">
                            {category.name?.en || "Chưa có tên tiếng Anh"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-on-surface-variant">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4">
                      <AdminPriorityInput
                        isDirty={isPriorityDirty(category)}
                        isSaving={savingPriorityId === category._id}
                        onChange={(value) =>
                          setPriorityDrafts((current) => ({
                            ...current,
                            [category._id]: value,
                          }))
                        }
                        onSave={() => void savePriority(category)}
                        value={getPriorityValue(category)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className={`inline-flex items-center gap-2 px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                          category.isVisible
                            ? "bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim"
                            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                        }`}
                        onClick={() =>
                          void updateCategory(
                            category._id,
                            { isVisible: !category.isVisible },
                            category.isVisible
                              ? "Đã ẩn danh mục khỏi website."
                              : "Đã hiển thị lại danh mục."
                          )
                        }
                        type="button"
                      >
                        {category.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                        {category.isVisible ? "Đang hiện" : "Đang ẩn"}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-on-surface-variant">
                      {formatAdminDate(category.updatedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="inline-flex items-center gap-2 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary"
                          onClick={() => openEditEditor(category)}
                          type="button"
                        >
                          <Pencil size={14} />
                          Sửa
                        </button>
                        <button
                          className="inline-flex items-center gap-2 border border-red-200 px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-red-600 transition-colors hover:bg-red-50"
                          onClick={() => void deleteCategory(category)}
                          type="button"
                        >
                          <Trash2 size={14} />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
