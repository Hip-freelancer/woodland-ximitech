"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

// Icons
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Newspaper,
  Pencil,
  Plus,
  Save,
  X,
} from "lucide-react";

// Admin UI
import AdminAutoSeoButton from "@/components/admin/AdminAutoSeoButton";
import AdminGalleryField from "@/components/admin/AdminGalleryField";
import AdminImageField from "@/components/admin/AdminImageField";
import AdminNotice from "@/components/admin/AdminNotice";
import AdminPriorityInput from "@/components/admin/AdminPriorityInput";
import AdminTranslateButton from "@/components/admin/AdminTranslateButton";
import RichEditor from "@/components/admin/RichEditor";

// Helpers
import { formatAdminDate, readAdminApiError } from "@/lib/adminClient";
import {
  getNextPrioritySortMode,
  sortAdminList,
  type AdminListSortMode,
} from "@/lib/adminListSort";
import {
  normalizeCategoryContentType,
  type CategoryContentType,
} from "@/lib/category";
import { createSlug } from "@/lib/slug";

interface LocalizedText {
  en: string;
  vi: string;
}

interface SeoFields {
  title: string;
  description: string;
  keywords: string;
}

interface AdminCategoryOption {
  _id: string;
  contentType?: CategoryContentType;
  name: LocalizedText;
  slug: string;
}

interface AdminNewsArticle {
  _id: string;
  author: string;
  category: string;
  content: LocalizedText;
  createdAt: string;
  excerpt: LocalizedText;
  galleryImages?: string[];
  faqItems?: unknown[];
  image: string;
  isVisible: boolean;
  priority: number;
  publishDate: string;
  relatedSlugs?: string[];
  seo: SeoFields;
  sourceUrl?: string;
  slug: string;
  tags: string[];
  title: LocalizedText;
  toc?: Array<{ id: string; level: number; title: string }>;
  contentBlocks?: unknown[];
  updatedAt: string;
}

interface NewsFormState {
  author: string;
  category: string;
  content: LocalizedText;
  excerpt: LocalizedText;
  galleryImages: string[];
  faqItemsJson: string;
  image: string;
  isVisible: boolean;
  priority: number;
  publishDate: string;
  relatedSlugsText: string;
  seo: SeoFields;
  sourceUrl: string;
  slug: string;
  tags: string;
  title: LocalizedText;
  tocJson: string;
  contentBlocksJson: string;
}

interface NoticeState {
  message: string;
  tone: "error" | "success" | "warning";
}

function createEmptyForm(category = ""): NewsFormState {
  return {
    author: "Editorial",
    category,
    content: { en: "", vi: "" },
    contentBlocksJson: "[]",
    excerpt: { en: "", vi: "" },
    faqItemsJson: "[]",
    galleryImages: [],
    image: "",
    isVisible: true,
    priority: 0,
    publishDate: new Date().toISOString().split("T")[0],
    relatedSlugsText: "",
    seo: { title: "", description: "", keywords: "" },
    sourceUrl: "",
    slug: "",
    tags: "",
    title: { en: "", vi: "" },
    tocJson: "[]",
  };
}

function resolveNewsSlug(title: LocalizedText) {
  return createSlug(title.vi || title.en);
}

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<AdminNewsArticle[]>([]);
  const [categories, setCategories] = useState<AdminCategoryOption[]>([]);
  const [formData, setFormData] = useState<NewsFormState>(createEmptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [priorityDrafts, setPriorityDrafts] = useState<Record<string, number>>({});
  const [savingPriorityId, setSavingPriorityId] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<AdminListSortMode>("created-desc");

  const showErrorNotice = (message: string) => {
    setNotice({ message, tone: "error" });
  };

  const sortedArticles = useMemo(
    () => sortAdminList(articles, sortMode),
    [articles, sortMode]
  );
  const newsCategories = useMemo(
    () =>
      categories.filter(
        (category) => normalizeCategoryContentType(category.contentType) === "news"
      ),
    [categories]
  );
  const categoryNameMap = useMemo(
    () =>
      new Map(
        newsCategories.map((category) => [category.slug, category.name?.vi || category.slug])
      ),
    [newsCategories]
  );

  const applyAutoSeo = (result: {
    seo?: {
      vi?: { title?: string; description?: string; keywords?: string[] };
      en?: { title?: string; description?: string; keywords?: string[] };
    };
    excerpt?: { vi?: string; en?: string };
  }) => {
    const seoVi = result.seo?.vi;

    if (!seoVi) {
      showErrorNotice("AI không trả về SEO tiếng Việt hợp lệ.");
      return;
    }

    setFormData((current) => ({
      ...current,
      excerpt: result.excerpt?.vi
        ? {
            ...current.excerpt,
            vi: current.excerpt.vi || result.excerpt.vi,
          }
        : current.excerpt,
      seo: {
        title: seoVi.title ?? current.seo.title,
        description: seoVi.description ?? current.seo.description,
        keywords: Array.isArray(seoVi.keywords)
          ? seoVi.keywords.join(", ")
          : current.seo.keywords,
      },
    }));
  };

  async function fetchNewsData(showLoading = true) {
    if (showLoading) {
      setIsLoading(true);
    }

    try {
      const [newsResponse, categoriesResponse] = await Promise.all([
        fetch("/api/admin/news"),
        fetch("/api/admin/categories"),
      ]);

      if (!newsResponse.ok) {
        throw new Error(
          await readAdminApiError(newsResponse, "Không thể tải danh sách bài viết.")
        );
      }

      if (!categoriesResponse.ok) {
        throw new Error(
          await readAdminApiError(
            categoriesResponse,
            "Không thể tải danh mục bài viết."
          )
        );
      }

      const articlesData = (await newsResponse.json()) as AdminNewsArticle[];
      const categoriesData = (await categoriesResponse.json()) as AdminCategoryOption[];
      const nextNewsCategories = categoriesData.filter(
        (category) => normalizeCategoryContentType(category.contentType) === "news"
      );

      setArticles(articlesData);
      setCategories(categoriesData);
      setFormData((current) =>
        current.category
          ? current
          : {
              ...current,
              category: nextNewsCategories[0]?.slug ?? "",
            }
      );
    } catch (error) {
      setNotice({
        message:
          error instanceof Error
            ? error.message
            : "Không thể tải danh sách bài viết.",
        tone: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchNewsData(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const resetEditor = () => {
    setEditingId(null);
    setFormData(createEmptyForm(newsCategories[0]?.slug ?? ""));
    setIsEditorOpen(false);
  };

  const openCreateEditor = () => {
    setNotice(null);
    setEditingId(null);
    setFormData(createEmptyForm(newsCategories[0]?.slug ?? ""));
    setIsEditorOpen(true);
  };

  const openEditEditor = (article: AdminNewsArticle) => {
    setNotice(null);
    setEditingId(article._id);
    setFormData({
      author: article.author ?? "Editorial",
      category: article.category ?? newsCategories[0]?.slug ?? "",
      content: {
        en: article.content?.en ?? "",
        vi: article.content?.vi ?? "",
      },
      contentBlocksJson: JSON.stringify(article.contentBlocks ?? [], null, 2),
      excerpt: {
        en: article.excerpt?.en ?? "",
        vi: article.excerpt?.vi ?? "",
      },
      faqItemsJson: JSON.stringify(article.faqItems ?? [], null, 2),
      galleryImages: (
        article.galleryImages?.length ? article.galleryImages : [article.image]
      ).filter(Boolean),
      image: article.image ?? "",
      isVisible: article.isVisible ?? true,
      priority: article.priority ?? 0,
      publishDate: article.publishDate
        ? new Date(article.publishDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      relatedSlugsText: (article.relatedSlugs ?? []).join(", "),
      seo: {
        description: article.seo?.description ?? "",
        keywords: article.seo?.keywords ?? "",
        title: article.seo?.title ?? "",
      },
      sourceUrl: article.sourceUrl ?? "",
      slug: article.slug ?? "",
      tags: Array.isArray(article.tags) ? article.tags.join(", ") : "",
      title: {
        en: article.title?.en ?? "",
        vi: article.title?.vi ?? "",
      },
      tocJson: JSON.stringify(article.toc ?? [], null, 2),
    });
    setIsEditorOpen(true);
  };

  const updateNewsTitle = (locale: keyof LocalizedText, value: string) => {
    setFormData((current) => {
      const nextTitle = { ...current.title, [locale]: value };
      return {
        ...current,
        slug: resolveNewsSlug(nextTitle),
        title: nextTitle,
      };
    });
  };

  const saveArticle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setNotice(null);

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/admin/news/${editingId}` : "/api/admin/news";
    const payload = {
      ...formData,
      contentBlocksJson: formData.contentBlocksJson,
      faqItemsJson: formData.faqItemsJson,
      galleryImages: formData.galleryImages,
      relatedSlugsText: formData.relatedSlugsText,
      sourceUrl: formData.sourceUrl,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      const response = await fetch(url, {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
        method,
      });

      if (!response.ok) {
        throw new Error(
          await readAdminApiError(response, "Không thể lưu bài viết.")
        );
      }

      await fetchNewsData();
      resetEditor();
      setNotice({
        message: editingId
          ? "Đã cập nhật bài viết."
          : "Đã tạo bài viết mới.",
        tone: "success",
      });
    } catch (error) {
      setNotice({
        message:
          error instanceof Error ? error.message : "Không thể lưu bài viết.",
        tone: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateArticle = async (
    articleId: string,
    payload: Partial<NewsFormState>,
    successMessage: string
  ) => {
    setNotice(null);

    try {
      const response = await fetch(`/api/admin/news/${articleId}`, {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error(
          await readAdminApiError(response, "Không thể cập nhật bài viết.")
        );
      }

      await fetchNewsData();
      setNotice({ message: successMessage, tone: "success" });
      return true;
    } catch (error) {
      setNotice({
        message:
          error instanceof Error
            ? error.message
            : "Không thể cập nhật bài viết.",
        tone: "error",
      });
      return false;
    }
  };

  const getPriorityValue = (article: AdminNewsArticle) =>
    priorityDrafts[article._id] ?? article.priority ?? 0;

  const isPriorityDirty = (article: AdminNewsArticle) =>
    getPriorityValue(article) !== (article.priority ?? 0);

  const savePriority = async (article: AdminNewsArticle) => {
    const nextPriority = getPriorityValue(article);

    if (nextPriority === (article.priority ?? 0)) {
      return;
    }

    setSavingPriorityId(article._id);

    const success = await updateArticle(
      article._id,
      { priority: nextPriority },
      "Đã lưu thứ tự ưu tiên bài viết."
    );

    setSavingPriorityId(null);

    if (success) {
      setPriorityDrafts((current) => {
        const nextDrafts = { ...current };
        delete nextDrafts[article._id];
        return nextDrafts;
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border border-outline-variant/40 bg-white p-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">
            Biên tập nội dung
          </p>
          <div className="flex items-start gap-4">
            <span className="mt-1 flex h-12 w-12 items-center justify-center bg-primary-fixed text-primary">
              <Newspaper size={22} />
            </span>
            <div>
              <h1 className="font-headline text-3xl font-black uppercase tracking-tight text-primary">
                Bài viết
              </h1>
              <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-on-surface-variant">
                Ảnh đại diện có thể nhập link hoặc tải file, nội dung rich editor giữ
                HTML khi lưu và có thể dịch nhanh sang tiếng Anh bằng AI.
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
          Thêm bài viết
        </button>
      </div>

      {notice ? <AdminNotice message={notice.message} tone={notice.tone} /> : null}
      {newsCategories.length === 0 ? (
        <AdminNotice
          message="Chưa có danh mục bài viết. Hãy tạo danh mục loại bài viết trước khi thêm bài mới."
          tone="warning"
        />
      ) : null}
      {articles.filter((a) => !a.title?.en).length > 0 ? (
        <AdminNotice
          message={`${articles.filter((a) => !a.title?.en).length} bài viết chưa có tiêu đề tiếng Anh. Nhấn "Sửa" và dùng nút dịch AI để bổ sung — website tiếng Anh sẽ hiển thị fallback tiếng Việt nếu thiếu.`}
          tone="warning"
        />
      ) : null}

      {isEditorOpen ? (
        <div className="border border-outline-variant/40 bg-white p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-headline text-2xl font-black uppercase tracking-tight text-primary">
                {editingId ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
              </h2>
              <p className="mt-2 font-body text-sm text-on-surface-variant">
                Slug tự sinh theo tiêu đề. Danh mục lấy từ dữ liệu danh mục đang có.
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

          <form className="space-y-6" onSubmit={saveArticle}>
            <div className="grid items-end gap-4 lg:grid-cols-2">
              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Tiêu đề tiếng Việt
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) => updateNewsTitle("vi", event.target.value)}
                  required
                  value={formData.title.vi}
                />
              </label>

              <label className="block space-y-2">
                <div className="flex items-end justify-between gap-3">
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Tiêu đề tiếng Anh
                  </span>
                  <AdminTranslateButton
                    fieldLabel="tiêu đề bài viết"
                    onError={showErrorNotice}
                    onTranslated={(value) =>
                      setFormData((current) => ({
                        ...current,
                        title: { ...current.title, en: value },
                      }))
                    }
                    sourceValue={formData.title.vi}
                  />
                </div>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) => updateNewsTitle("en", event.target.value)}
                  required
                  value={formData.title.en}
                />
              </label>
            </div>

            <div className="grid items-end gap-4 lg:grid-cols-[1.2fr_1fr_0.8fr]">
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
                  Danh mục
                </span>
                <select
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  required
                  value={formData.category}
                >
                  {newsCategories.length === 0 ? (
                    <option value="">Chưa có danh mục</option>
                  ) : null}
                  {formData.category &&
                  !newsCategories.some(
                    (category) => category.slug === formData.category
                  ) ? (
                    <option value={formData.category}>
                      {formData.category} (không còn trong danh mục bài viết)
                    </option>
                  ) : null}
                  {newsCategories.map((category) => (
                    <option key={category._id} value={category.slug}>
                      {category.name?.vi || category.slug}
                    </option>
                  ))}
                </select>
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
            </div>

            <AdminImageField
              helperText="Có thể tải file hoặc dùng link ảnh. Ảnh xem trước sẽ hiển thị ngay bên dưới."
              label="Ảnh đại diện"
              onChange={(value) =>
                setFormData((current) => ({
                  ...current,
                  image: value,
                }))
              }
              required
              value={formData.image}
            />

            <AdminGalleryField
              label="Thư viện ảnh bài viết"
              onChange={(value) =>
                setFormData((current) => ({
                  ...current,
                  galleryImages: value,
                  image: current.image || value[0] || "",
                }))
              }
              values={formData.galleryImages}
            />

            <div className="grid items-end gap-4 lg:grid-cols-[1fr_1fr_0.8fr_0.6fr]">
              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Tác giả
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      author: event.target.value,
                    }))
                  }
                  required
                  value={formData.author}
                />
              </label>

              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Thẻ nội dung
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      tags: event.target.value,
                    }))
                  }
                  placeholder="timber, export, europe"
                  value={formData.tags}
                />
              </label>

              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Ngày đăng
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      publishDate: event.target.value,
                    }))
                  }
                  required
                  type="date"
                  value={formData.publishDate}
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

            <div className="grid items-end gap-4 lg:grid-cols-2">
              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  URL gốc Woodland
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      sourceUrl: event.target.value,
                    }))
                  }
                  placeholder="https://woodland.vn/..."
                  value={formData.sourceUrl}
                />
              </label>

              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Slug bài liên quan
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      relatedSlugsText: event.target.value,
                    }))
                  }
                  placeholder="slug-1, slug-2"
                  value={formData.relatedSlugsText}
                />
              </label>
            </div>

            <div className="grid items-end gap-6 lg:grid-cols-2">
              <div>
                <p className="mb-2 font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Đoạn trích tiếng Việt
                </p>
                <textarea
                  className="min-h-28 w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      excerpt: { ...current.excerpt, vi: event.target.value },
                    }))
                  }
                  required
                  value={formData.excerpt.vi}
                />
              </div>

              <div>
                <div className="mb-2 flex items-end justify-between gap-3">
                  <p className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Đoạn trích tiếng Anh
                  </p>
                  <AdminTranslateButton
                    fieldLabel="đoạn trích bài viết"
                    onError={showErrorNotice}
                    onTranslated={(value) =>
                      setFormData((current) => ({
                        ...current,
                        excerpt: { ...current.excerpt, en: value },
                      }))
                    }
                    sourceValue={formData.excerpt.vi}
                  />
                </div>
                <textarea
                  className="min-h-28 w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      excerpt: { ...current.excerpt, en: event.target.value },
                    }))
                  }
                  required
                  value={formData.excerpt.en}
                />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Mục lục JSON
                </span>
                <textarea
                  className="min-h-36 w-full border border-outline-variant bg-surface px-4 py-3 font-mono text-xs outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      tocJson: event.target.value,
                    }))
                  }
                  value={formData.tocJson}
                />
              </label>

              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Content blocks JSON
                </span>
                <textarea
                  className="min-h-36 w-full border border-outline-variant bg-surface px-4 py-3 font-mono text-xs outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      contentBlocksJson: event.target.value,
                    }))
                  }
                  value={formData.contentBlocksJson}
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                FAQ JSON
              </span>
              <textarea
                className="min-h-36 w-full border border-outline-variant bg-surface px-4 py-3 font-mono text-xs outline-none transition-colors focus:border-secondary"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    faqItemsJson: event.target.value,
                  }))
                }
                value={formData.faqItemsJson}
              />
            </label>

            <div className="space-y-4">
              <div>
                <p className="mb-2 font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Nội dung tiếng Việt
                </p>
                <RichEditor
                  onChange={(value) =>
                    setFormData((current) => ({
                      ...current,
                      content: { ...current.content, vi: value },
                    }))
                  }
                  value={formData.content.vi}
                />
              </div>

              <div>
                <div className="mb-2 flex items-end justify-between gap-3">
                  <p className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Nội dung tiếng Anh
                  </p>
                  <AdminTranslateButton
                    fieldLabel="nội dung bài viết"
                    onError={showErrorNotice}
                    onTranslated={(value) =>
                      setFormData((current) => ({
                        ...current,
                        content: { ...current.content, en: value },
                      }))
                    }
                    preserveHtml
                    sourceValue={formData.content.vi}
                  />
                </div>
                <RichEditor
                  onChange={(value) =>
                    setFormData((current) => ({
                      ...current,
                      content: { ...current.content, en: value },
                    }))
                  }
                  value={formData.content.en}
                />
              </div>
            </div>

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
                  module="news"
                  onError={showErrorNotice}
                  onGenerated={applyAutoSeo}
                  payload={{
                    title: formData.title,
                    slug: formData.slug,
                    excerpt: formData.excerpt,
                    content: formData.content,
                    tags: formData.tags,
                    category: formData.category,
                    author: formData.author,
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
              {isSaving ? "Đang lưu..." : editingId ? "Lưu thay đổi" : "Tạo bài viết"}
            </button>
          </form>
        </div>
      ) : null}

      <div className="overflow-hidden border border-outline-variant/40 bg-white">
        <div className="flex flex-col gap-3 border-b border-outline-variant/40 bg-surface-container-low/40 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">
              Mặc định sắp xếp theo bài viết tạo gần nhất
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
                Bài viết
              </th>
              <th className="px-6 py-4 text-left font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                Danh mục
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  className="inline-flex items-center gap-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:text-secondary"
                  onClick={() => setSortMode((current) => getNextPrioritySortMode(current))}
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
                Ngày đăng
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
                  Đang tải bài viết...
                </td>
              </tr>
            ) : null}

            {!isLoading && articles.length === 0 ? (
              <tr>
                <td
                  className="px-6 py-10 text-center font-body text-sm text-on-surface-variant"
                  colSpan={6}
                >
                  Chưa có bài viết nào.
                </td>
              </tr>
            ) : null}

            {!isLoading
              ? sortedArticles.map((article) => (
                  <tr key={article._id} className="hover:bg-surface-container-low/60">
                    <td className="px-6 py-4">
                      <div className="font-body text-sm font-semibold text-on-surface">
                        {article.title?.vi || "Chưa có tiêu đề"}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 font-body text-xs text-on-surface-variant">
                        <span>{article.slug}</span>
                        {!article.title?.en ? (
                          <span className="inline-flex items-center bg-amber-100 px-2 py-0.5 font-label text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                            Thiếu EN
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-on-surface-variant">
                      {categoryNameMap.get(article.category) || article.category}
                    </td>
                    <td className="px-6 py-4">
                      <AdminPriorityInput
                        isDirty={isPriorityDirty(article)}
                        isSaving={savingPriorityId === article._id}
                        onChange={(value) =>
                          setPriorityDrafts((current) => ({
                            ...current,
                            [article._id]: value,
                          }))
                        }
                        onSave={() => void savePriority(article)}
                        value={getPriorityValue(article)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className={`inline-flex items-center gap-2 px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                          article.isVisible
                            ? "bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim"
                            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                        }`}
                        onClick={() =>
                          void updateArticle(
                            article._id,
                            { isVisible: !article.isVisible },
                            article.isVisible
                              ? "Đã ẩn bài viết khỏi website."
                              : "Đã hiển thị lại bài viết."
                          )
                        }
                        type="button"
                      >
                        {article.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                        {article.isVisible ? "Đang hiện" : "Đang ẩn"}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-on-surface-variant">
                      {formatAdminDate(article.publishDate)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="inline-flex items-center gap-2 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary"
                        onClick={() => openEditEditor(article)}
                        type="button"
                      >
                        <Pencil size={14} />
                        Sửa
                      </button>
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
