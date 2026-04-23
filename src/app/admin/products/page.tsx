"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

// Icons
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Package,
  Pencil,
  Plus,
  Save,
  Star,
  X,
} from "lucide-react";

// Admin UI
import AdminAutoSeoButton from "@/components/admin/AdminAutoSeoButton";
import AdminGalleryField from "@/components/admin/AdminGalleryField";
import AdminNotice from "@/components/admin/AdminNotice";
import AdminProductApplicationsEditor from "@/components/admin/AdminProductApplicationsEditor";
import AdminProductSpecificationsEditor from "@/components/admin/AdminProductSpecificationsEditor";
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
  image?: string;
  name: LocalizedText;
  slug: string;
}

interface ProductSpecification {
  attribute: LocalizedText;
  specification: LocalizedText;
  standard: string;
  tolerance: string;
}

interface ProductApplication {
  image: string;
  order: number;
  subtitle: LocalizedText;
  title: LocalizedText;
}

interface AdminProduct {
  _id: string;
  applications: ProductApplication[];
  availability: LocalizedText;
  bonding: LocalizedText;
  category: string;
  certifications: string[];
  createdAt: string;
  description: LocalizedText;
  dimensions: string[];
  featured: boolean;
  galleryImages: string[];
  grade: LocalizedText;
  image: string;
  isVisible: boolean;
  material: LocalizedText;
  name: LocalizedText;
  priority: number;
  seo: SeoFields;
  series: string;
  slug: string;
  specifications: ProductSpecification[];
  thickness: number[];
  updatedAt: string;
}

interface ProductFormState {
  applications: ProductApplication[];
  availability: LocalizedText;
  bonding: LocalizedText;
  category: string;
  certificationsText: string;
  description: LocalizedText;
  dimensionsText: string;
  featured: boolean;
  galleryImages: string[];
  grade: LocalizedText;
  isVisible: boolean;
  material: LocalizedText;
  name: LocalizedText;
  priority: number;
  seo: SeoFields;
  series: string;
  slug: string;
  specifications: ProductSpecification[];
  thicknessText: string;
}

interface NoticeState {
  message: string;
  tone: "error" | "success" | "warning";
}

function createEmptyForm(category = ""): ProductFormState {
  return {
    applications: [],
    availability: { en: "In Stock", vi: "Còn Hàng" },
    bonding: { en: "", vi: "" },
    category,
    certificationsText: "",
    description: { en: "", vi: "" },
    dimensionsText: "",
    featured: false,
    galleryImages: [],
    grade: { en: "", vi: "" },
    isVisible: true,
    material: { en: "", vi: "" },
    name: { en: "", vi: "" },
    priority: 0,
    seo: { title: "", description: "", keywords: "" },
    series: "",
    slug: "",
    specifications: [],
    thicknessText: "",
  };
}

function resolveProductSlug(name: LocalizedText) {
  return createSlug(name.vi || name.en);
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategoryOption[]>([]);
  const [formData, setFormData] = useState<ProductFormState>(createEmptyForm);
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

  const sortedProducts = useMemo(
    () => sortAdminList(products, sortMode),
    [products, sortMode]
  );
  const productCategories = useMemo(
    () =>
      categories.filter(
        (category) => normalizeCategoryContentType(category.contentType) === "product"
      ),
    [categories]
  );
  const categoryNameMap = useMemo(
    () =>
      new Map(
        productCategories.map((category) => [
          category.slug,
          category.name?.vi || category.slug,
        ])
      ),
    [productCategories]
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

  async function fetchInitialData(showLoading = true) {
    if (showLoading) {
      setIsLoading(true);
    }

    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
      ]);

      if (!productsResponse.ok) {
        throw new Error(
          await readAdminApiError(
            productsResponse,
            "Không thể tải danh sách sản phẩm."
          )
        );
      }

      if (!categoriesResponse.ok) {
        throw new Error(
          await readAdminApiError(
            categoriesResponse,
            "Không thể tải danh mục sản phẩm."
          )
        );
      }

      const productsData = (await productsResponse.json()) as AdminProduct[];
      const categoriesData = (await categoriesResponse.json()) as AdminCategoryOption[];
      const nextProductCategories = categoriesData.filter(
        (category) => normalizeCategoryContentType(category.contentType) === "product"
      );

      setProducts(productsData);
      setCategories(categoriesData);
      setFormData((current) =>
        current.category
          ? current
          : {
              ...current,
              category: nextProductCategories[0]?.slug ?? "",
            }
      );
    } catch (error) {
      setNotice({
        message:
          error instanceof Error
            ? error.message
            : "Không thể tải dữ liệu sản phẩm.",
        tone: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchInitialData(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const resetEditor = () => {
    setEditingId(null);
    setFormData(createEmptyForm(productCategories[0]?.slug ?? ""));
    setIsEditorOpen(false);
  };

  const openCreateEditor = () => {
    setNotice(null);
    setEditingId(null);
    setFormData(createEmptyForm(productCategories[0]?.slug ?? ""));
    setIsEditorOpen(true);
  };

  const openEditEditor = (product: AdminProduct) => {
    setNotice(null);
    setEditingId(product._id);
    setFormData({
      applications: product.applications ?? [],
      availability: {
        en: product.availability?.en ?? "",
        vi: product.availability?.vi ?? "",
      },
      bonding: {
        en: product.bonding?.en ?? "",
        vi: product.bonding?.vi ?? "",
      },
      category: product.category ?? categories[0]?.slug ?? "",
      certificationsText: (product.certifications ?? []).join(", "),
      description: {
        en: product.description?.en ?? "",
        vi: product.description?.vi ?? "",
      },
      dimensionsText: (product.dimensions ?? []).join(", "),
      featured: product.featured ?? false,
      galleryImages: (
        product.galleryImages?.length ? product.galleryImages : [product.image]
      )
        .filter(Boolean),
      grade: {
        en: product.grade?.en ?? "",
        vi: product.grade?.vi ?? "",
      },
      isVisible: product.isVisible ?? true,
      material: {
        en: product.material?.en ?? "",
        vi: product.material?.vi ?? "",
      },
      name: {
        en: product.name?.en ?? "",
        vi: product.name?.vi ?? "",
      },
      priority: product.priority ?? 0,
      seo: {
        description: product.seo?.description ?? "",
        keywords: product.seo?.keywords ?? "",
        title: product.seo?.title ?? "",
      },
      series: product.series ?? "",
      slug: product.slug ?? "",
      specifications: product.specifications ?? [],
      thicknessText: (product.thickness ?? []).join(", "),
    });
    setIsEditorOpen(true);
  };

  const updateProductName = (locale: keyof LocalizedText, value: string) => {
    setFormData((current) => {
      const nextName = { ...current.name, [locale]: value };
      return {
        ...current,
        name: nextName,
        slug: resolveProductSlug(nextName),
      };
    });
  };

  const saveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setNotice(null);

    if (formData.galleryImages.length === 0) {
      setNotice({
        message: "Cần ít nhất một ảnh sản phẩm để lưu.",
        tone: "error",
      });
      setIsSaving(false);
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `/api/admin/products/${editingId}`
      : "/api/admin/products";

    try {
      const response = await fetch(url, {
        body: JSON.stringify({
          applications: formData.applications,
          availability: formData.availability,
          bonding: formData.bonding,
          category: formData.category,
          certificationsText: formData.certificationsText,
          description: formData.description,
          dimensionsText: formData.dimensionsText,
          featured: formData.featured,
          galleryImages: formData.galleryImages,
          grade: formData.grade,
          isVisible: formData.isVisible,
          material: formData.material,
          name: formData.name,
          priority: formData.priority,
          seo: formData.seo,
          series: formData.series,
          slug: formData.slug,
          specifications: formData.specifications,
          thicknessText: formData.thicknessText,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method,
      });

      if (!response.ok) {
        throw new Error(
          await readAdminApiError(response, "Không thể lưu sản phẩm.")
        );
      }

      await fetchInitialData();
      resetEditor();
      setNotice({
        message: editingId
          ? "Đã cập nhật sản phẩm."
          : "Đã tạo sản phẩm mới.",
        tone: "success",
      });
    } catch (error) {
      setNotice({
        message:
          error instanceof Error ? error.message : "Không thể lưu sản phẩm.",
        tone: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateProduct = async (
    productId: string,
    payload: Partial<ProductFormState>,
    successMessage: string
  ) => {
    setNotice(null);

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error(
          await readAdminApiError(response, "Không thể cập nhật sản phẩm.")
        );
      }

      await fetchInitialData();
      setNotice({ message: successMessage, tone: "success" });
      return true;
    } catch (error) {
      setNotice({
        message:
          error instanceof Error
            ? error.message
            : "Không thể cập nhật sản phẩm.",
        tone: "error",
      });
      return false;
    }
  };

  const getPriorityValue = (product: AdminProduct) =>
    priorityDrafts[product._id] ?? product.priority ?? 0;

  const isPriorityDirty = (product: AdminProduct) =>
    getPriorityValue(product) !== (product.priority ?? 0);

  const savePriority = async (product: AdminProduct) => {
    const nextPriority = getPriorityValue(product);

    if (nextPriority === (product.priority ?? 0)) {
      return;
    }

    setSavingPriorityId(product._id);

    const success = await updateProduct(
      product._id,
      { priority: nextPriority },
      "Đã lưu thứ tự ưu tiên sản phẩm."
    );

    setSavingPriorityId(null);

    if (success) {
      setPriorityDrafts((current) => {
        const nextDrafts = { ...current };
        delete nextDrafts[product._id];
        return nextDrafts;
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border border-outline-variant/40 bg-white p-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">
            Quản lý sản phẩm
          </p>
          <div className="flex items-start gap-4">
            <span className="mt-1 flex h-12 w-12 items-center justify-center bg-primary-fixed text-primary">
              <Package size={22} />
            </span>
            <div>
              <h1 className="font-headline text-3xl font-black uppercase tracking-tight text-primary">
                Sản phẩm
              </h1>
              <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-on-surface-variant">
                Biểu mẫu bám sát model dữ liệu, hỗ trợ nhiều ảnh có xem trước, dịch
                AI cho các nội dung song ngữ và giữ nguyên HTML rich editor khi lưu.
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
          Thêm sản phẩm
        </button>
      </div>

      {notice ? <AdminNotice message={notice.message} tone={notice.tone} /> : null}
      {productCategories.length === 0 ? (
        <AdminNotice
          message="Chưa có danh mục sản phẩm. Hãy tạo danh mục loại sản phẩm trước khi thêm sản phẩm mới."
          tone="warning"
        />
      ) : null}

      {isEditorOpen ? (
        <div className="border border-outline-variant/40 bg-white p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-headline text-2xl font-black uppercase tracking-tight text-primary">
                {editingId ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm mới"}
              </h2>
              <p className="mt-2 font-body text-sm text-on-surface-variant">
                Slug tự sinh theo tên. Thứ tự ảnh trong thư viện sẽ được giữ nguyên,
                và ảnh đầu tiên luôn là ảnh chính của sản phẩm.
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

          <form className="space-y-6" onSubmit={saveProduct}>
            <div className="grid items-end gap-4 lg:grid-cols-2">
              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Tên sản phẩm tiếng Việt
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) => updateProductName("vi", event.target.value)}
                  required
                  value={formData.name.vi}
                />
              </label>

              <label className="block space-y-2">
                <div className="flex items-end justify-between gap-3">
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Tên sản phẩm tiếng Anh
                  </span>
                  <AdminTranslateButton
                    fieldLabel="tên sản phẩm"
                    onError={showErrorNotice}
                    onTranslated={(value) => updateProductName("en", value)}
                    sourceValue={formData.name.vi}
                  />
                </div>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) => updateProductName("en", event.target.value)}
                  required
                  value={formData.name.en}
                />
              </label>
            </div>

            <div className="grid items-end gap-4 lg:grid-cols-[1fr_1fr_1fr_0.7fr]">
              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Dòng sản phẩm
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      series: event.target.value,
                    }))
                  }
                  required
                  value={formData.series}
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
                  {productCategories.length === 0 ? (
                    <option value="">Chưa có danh mục</option>
                  ) : null}
                  {formData.category &&
                  !productCategories.some(
                    (category) => category.slug === formData.category
                  ) ? (
                    <option value={formData.category}>
                      {formData.category} (không còn trong danh mục sản phẩm)
                    </option>
                  ) : null}
                  {productCategories.map((category) => (
                    <option key={category._id} value={category.slug}>
                      {category.name?.vi || category.slug}
                    </option>
                  ))}
                </select>
              </label>

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
            </div>

            <div className="grid items-end gap-4 lg:grid-cols-2">
              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Phân hạng tiếng Việt
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      grade: { ...current.grade, vi: event.target.value },
                    }))
                  }
                  required
                  value={formData.grade.vi}
                />
              </label>

              <label className="block space-y-2">
                <div className="flex items-end justify-between gap-3">
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Phân hạng tiếng Anh
                  </span>
                  <AdminTranslateButton
                    fieldLabel="phân hạng sản phẩm"
                    onError={showErrorNotice}
                    onTranslated={(value) =>
                      setFormData((current) => ({
                        ...current,
                        grade: { ...current.grade, en: value },
                      }))
                    }
                    sourceValue={formData.grade.vi}
                  />
                </div>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      grade: { ...current.grade, en: event.target.value },
                    }))
                  }
                  required
                  value={formData.grade.en}
                />
              </label>
            </div>

            <div className="grid items-end gap-4 lg:grid-cols-3">
              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Vật liệu tiếng Việt
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      material: { ...current.material, vi: event.target.value },
                    }))
                  }
                  value={formData.material.vi}
                />
              </label>

              <label className="block space-y-2">
                <div className="flex items-end justify-between gap-3">
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Vật liệu tiếng Anh
                  </span>
                  <AdminTranslateButton
                    fieldLabel="vật liệu sản phẩm"
                    onError={showErrorNotice}
                    onTranslated={(value) =>
                      setFormData((current) => ({
                        ...current,
                        material: { ...current.material, en: value },
                      }))
                    }
                    sourceValue={formData.material.vi}
                  />
                </div>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      material: { ...current.material, en: event.target.value },
                    }))
                  }
                  value={formData.material.en}
                />
              </label>

              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Độ dày
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      thicknessText: event.target.value,
                    }))
                  }
                  placeholder="12, 18, 24"
                  value={formData.thicknessText}
                />
              </label>
            </div>

            <div className="grid items-end gap-4 lg:grid-cols-3">
              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Loại keo tiếng Việt
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      bonding: { ...current.bonding, vi: event.target.value },
                    }))
                  }
                  value={formData.bonding.vi}
                />
              </label>

              <label className="block space-y-2">
                <div className="flex items-end justify-between gap-3">
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Loại keo tiếng Anh
                  </span>
                  <AdminTranslateButton
                    fieldLabel="loại keo liên kết"
                    onError={showErrorNotice}
                    onTranslated={(value) =>
                      setFormData((current) => ({
                        ...current,
                        bonding: { ...current.bonding, en: value },
                      }))
                    }
                    sourceValue={formData.bonding.vi}
                  />
                </div>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      bonding: { ...current.bonding, en: event.target.value },
                    }))
                  }
                  value={formData.bonding.en}
                />
              </label>

              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Kích thước
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      dimensionsText: event.target.value,
                    }))
                  }
                  placeholder="1220x2440mm, 1525x3050mm"
                  value={formData.dimensionsText}
                />
              </label>
            </div>

            <div className="grid items-end gap-4 lg:grid-cols-3">
              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Tình trạng tiếng Việt
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      availability: {
                        ...current.availability,
                        vi: event.target.value,
                      },
                    }))
                  }
                  value={formData.availability.vi}
                />
              </label>

              <label className="block space-y-2">
                <div className="flex items-end justify-between gap-3">
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Tình trạng tiếng Anh
                  </span>
                  <AdminTranslateButton
                    fieldLabel="tình trạng sản phẩm"
                    onError={showErrorNotice}
                    onTranslated={(value) =>
                      setFormData((current) => ({
                        ...current,
                        availability: { ...current.availability, en: value },
                      }))
                    }
                    sourceValue={formData.availability.vi}
                  />
                </div>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      availability: {
                        ...current.availability,
                        en: event.target.value,
                      },
                    }))
                  }
                  value={formData.availability.en}
                />
              </label>

              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Chứng chỉ
                </span>
                <input
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      certificationsText: event.target.value,
                    }))
                  }
                  placeholder="FSC, PEFC"
                  value={formData.certificationsText}
                />
              </label>
            </div>

            <div className="grid items-end gap-4 lg:grid-cols-2">
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

              <label className="flex items-center gap-3 border border-outline-variant bg-surface px-4 py-3">
                <input
                  checked={formData.featured}
                  className="h-4 w-4 accent-secondary"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      featured: event.target.checked,
                    }))
                  }
                  type="checkbox"
                />
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Sản phẩm nổi bật
                </span>
              </label>
            </div>

            <AdminGalleryField
              label="Thư viện ảnh sản phẩm"
              onChange={(value) =>
                setFormData((current) => ({
                  ...current,
                  galleryImages: value,
                }))
              }
              values={formData.galleryImages}
            />

            <div className="space-y-4">
              <div>
                <p className="mb-2 font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Mô tả tiếng Việt
                </p>
                <RichEditor
                  onChange={(value) =>
                    setFormData((current) => ({
                      ...current,
                      description: { ...current.description, vi: value },
                    }))
                  }
                  value={formData.description.vi}
                />
              </div>
              <div>
                <div className="mb-2 flex items-end justify-between gap-3">
                  <p className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Mô tả tiếng Anh
                  </p>
                  <AdminTranslateButton
                    fieldLabel="mô tả sản phẩm"
                    onError={showErrorNotice}
                    onTranslated={(value) =>
                      setFormData((current) => ({
                        ...current,
                        description: { ...current.description, en: value },
                      }))
                    }
                    preserveHtml
                    sourceValue={formData.description.vi}
                  />
                </div>
                <RichEditor
                  onChange={(value) =>
                    setFormData((current) => ({
                      ...current,
                      description: { ...current.description, en: value },
                    }))
                  }
                  value={formData.description.en}
                />
              </div>
            </div>

            <AdminProductSpecificationsEditor
              items={formData.specifications}
              onChange={(value) =>
                setFormData((current) => ({
                  ...current,
                  specifications: value,
                }))
              }
              onError={showErrorNotice}
            />

            <AdminProductApplicationsEditor
              items={formData.applications}
              onChange={(value) =>
                setFormData((current) => ({
                  ...current,
                  applications: value,
                }))
              }
              onError={showErrorNotice}
            />

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
                module="product"
                onError={showErrorNotice}
                onGenerated={applyAutoSeo}
                payload={{
                  name: formData.name,
                  series: formData.series,
                  slug: formData.slug,
                  description: formData.description,
                  category: formData.category,
                  grade: formData.grade,
                  material: formData.material,
                  bonding: formData.bonding,
                  availability: formData.availability,
                  certifications: formData.certificationsText,
                }}
              />
            </div>

            <button
              className="inline-flex items-center gap-2 bg-primary px-5 py-4 font-label text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:bg-primary/60"
              disabled={isSaving}
              type="submit"
            >
              <Save size={15} />
              {isSaving ? "Đang lưu..." : editingId ? "Lưu thay đổi" : "Tạo sản phẩm"}
            </button>
          </form>
        </div>
      ) : null}

      <div className="overflow-hidden border border-outline-variant/40 bg-white">
        <div className="flex flex-col gap-3 border-b border-outline-variant/40 bg-surface-container-low/40 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">
              Mặc định sắp xếp theo sản phẩm tạo gần nhất
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
                Sản phẩm
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
                  Đang tải sản phẩm...
                </td>
              </tr>
            ) : null}

            {!isLoading && products.length === 0 ? (
              <tr>
                <td
                  className="px-6 py-10 text-center font-body text-sm text-on-surface-variant"
                  colSpan={6}
                >
                  Chưa có dữ liệu sản phẩm.
                </td>
              </tr>
            ) : null}

            {!isLoading
              ? sortedProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-surface-container-low/60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden bg-surface-container">
                          {product.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              alt={product.name?.vi || product.slug}
                              className="h-full w-full object-cover"
                              src={product.image}
                            />
                          ) : null}
                        </div>
                        <div>
                          <div className="font-body text-sm font-semibold text-on-surface">
                            {product.name?.vi || "Chưa đặt tên"}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 font-body text-xs text-on-surface-variant">
                            <span>{product.series || "Chưa có dòng sản phẩm"}</span>
                            <span>{product.slug}</span>
                            {product.featured ? (
                              <span className="inline-flex items-center gap-1 bg-primary-fixed px-2 py-1 font-label text-[10px] font-semibold uppercase tracking-[0.14em] text-on-primary-fixed">
                                <Star size={12} />
                                Nổi bật
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-on-surface-variant">
                      {categoryNameMap.get(product.category) ||
                        product.category ||
                        "Chưa gán danh mục"}
                    </td>
                    <td className="px-6 py-4">
                      <AdminPriorityInput
                        isDirty={isPriorityDirty(product)}
                        isSaving={savingPriorityId === product._id}
                        onChange={(value) =>
                          setPriorityDrafts((current) => ({
                            ...current,
                            [product._id]: value,
                          }))
                        }
                        onSave={() => void savePriority(product)}
                        value={getPriorityValue(product)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className={`inline-flex items-center gap-2 px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                          product.isVisible
                            ? "bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim"
                            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                        }`}
                        onClick={() =>
                          void updateProduct(
                            product._id,
                            { isVisible: !product.isVisible },
                            product.isVisible
                              ? "Đã ẩn sản phẩm khỏi website."
                              : "Đã hiển thị lại sản phẩm."
                          )
                        }
                        type="button"
                      >
                        {product.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                        {product.isVisible ? "Đang hiện" : "Đang ẩn"}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-on-surface-variant">
                      {formatAdminDate(product.updatedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="inline-flex items-center gap-2 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary"
                        onClick={() => openEditEditor(product)}
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
