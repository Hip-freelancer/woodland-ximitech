"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Mail,
  Phone,
  Plus,
  Save,
  Video,
} from "lucide-react";
import AdminImageField from "@/components/admin/AdminImageField";
import AdminNotice from "@/components/admin/AdminNotice";
import AdminVideoField from "@/components/admin/AdminVideoField";
import { readAdminApiError } from "@/lib/adminClient";
import { DEFAULT_HOME_SETTINGS } from "@/lib/homeSettingsDefaults";
import type { HomeHeroSlide, HomeHeroStat, HomeSettings } from "@/types";

interface NoticeState {
  message: string;
  tone: "error" | "success" | "warning";
}

function createDefaultSlide(order: number): HomeHeroSlide {
  return {
    alt: { en: "", vi: "" },
    isVisible: true,
    mediaType: "image",
    mediaUrl: "",
    order,
    posterUrl: "",
  };
}

function createDefaultState(): Omit<
  HomeSettings,
  "_id" | "createdAt" | "updatedAt"
> {
  return {
    contactEmail: DEFAULT_HOME_SETTINGS.contactEmail,
    contactPhone: DEFAULT_HOME_SETTINGS.contactPhone,
    heroSlides: [createDefaultSlide(0)],
    heroStats: DEFAULT_HOME_SETTINGS.heroStats,
  };
}

function sortByOrder<T extends { order: number }>(items: T[]) {
  return [...items].sort((left, right) => left.order - right.order);
}

export default function AdminHomeSettingsPage() {
  const [recordId, setRecordId] = useState("");
  const [formData, setFormData] = useState(createDefaultState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<NoticeState | null>(null);

  const sortedSlides = useMemo(
    () => sortByOrder(formData.heroSlides),
    [formData.heroSlides],
  );
  const sortedStats = useMemo(
    () => sortByOrder(formData.heroStats),
    [formData.heroStats],
  );

  async function fetchHomeSettings(showLoading = true) {
    if (showLoading) {
      setIsLoading(true);
    }

    try {
      const response = await fetch("/api/admin/home-settings");

      if (!response.ok) {
        throw new Error(
          await readAdminApiError(
            response,
            "Không thể tải cấu hình trang chủ.",
          ),
        );
      }

      const data = (await response.json()) as HomeSettings[];
      const current = data[0];

      if (!current) {
        setRecordId("");
        setFormData(createDefaultState());
        return;
      }

      setRecordId(current._id);
      setFormData({
        contactEmail: current.contactEmail ?? "",
        contactPhone: current.contactPhone ?? "",
        heroSlides:
          current.heroSlides?.length > 0
            ? current.heroSlides
            : [createDefaultSlide(0)],
        heroStats:
          current.heroStats?.length > 0
            ? current.heroStats
            : DEFAULT_HOME_SETTINGS.heroStats,
      });
    } catch (error) {
      setNotice({
        message:
          error instanceof Error
            ? error.message
            : "Không thể tải cấu hình trang chủ.",
        tone: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchHomeSettings(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const updateSlide = (
    targetOrder: number,
    updater: (slide: HomeHeroSlide) => HomeHeroSlide,
  ) => {
    setFormData((current) => ({
      ...current,
      heroSlides: current.heroSlides.map((slide) =>
        slide.order === targetOrder ? updater(slide) : slide,
      ),
    }));
  };

  const updateStat = (
    targetOrder: number,
    updater: (stat: HomeHeroStat) => HomeHeroStat,
  ) => {
    setFormData((current) => ({
      ...current,
      heroStats: current.heroStats.map((stat) =>
        stat.order === targetOrder ? updater(stat) : stat,
      ),
    }));
  };

  const moveSlide = (targetOrder: number, direction: -1 | 1) => {
    setFormData((current) => {
      const nextSlides = sortByOrder(current.heroSlides);
      const index = nextSlides.findIndex(
        (slide) => slide.order === targetOrder,
      );
      const swapIndex = index + direction;

      if (index < 0 || swapIndex < 0 || swapIndex >= nextSlides.length) {
        return current;
      }

      const next = [...nextSlides];
      const currentOrder = next[index].order;
      next[index] = { ...next[index], order: next[swapIndex].order };
      next[swapIndex] = { ...next[swapIndex], order: currentOrder };

      return { ...current, heroSlides: next };
    });
  };

  const handleAddSlide = () => {
    setFormData((current) => ({
      ...current,
      heroSlides: [
        ...current.heroSlides,
        createDefaultSlide(current.heroSlides.length),
      ],
    }));
  };

  const handleRemoveSlide = (targetOrder: number) => {
    setFormData((current) => ({
      ...current,
      heroSlides: current.heroSlides
        .filter((slide) => slide.order !== targetOrder)
        .map((slide, index) => ({ ...slide, order: index })),
    }));
  };

  const handleContactChange =
    (field: "contactEmail" | "contactPhone") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormData((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  async function handleSave() {
    setIsSaving(true);
    setNotice(null);

    try {
      const payload = {
        contactEmail: formData.contactEmail.trim(),
        contactPhone: formData.contactPhone.trim(),
        heroSlides: sortByOrder(formData.heroSlides),
        heroStats: sortByOrder(formData.heroStats),
      };

      const response = await fetch(
        recordId
          ? `/api/admin/home-settings/${recordId}`
          : "/api/admin/home-settings",
        {
          method: recordId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(
          await readAdminApiError(
            response,
            "Không thể lưu cấu hình trang chủ.",
          ),
        );
      }

      const savedData = (await response.json()) as HomeSettings;

      setRecordId(savedData._id);
      setNotice({
        message: "Đã lưu cấu hình hero trang chủ.",
        tone: "success",
      });
      await fetchHomeSettings(false);
    } catch (error) {
      setNotice({
        message:
          error instanceof Error
            ? error.message
            : "Không thể lưu cấu hình trang chủ.",
        tone: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="border border-outline-variant/40 bg-white p-6">
        <p className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">
          Trang chủ
        </p>
        <h1 className="mt-3 font-headline text-3xl font-black uppercase tracking-tight text-primary">
          Hero media và liên hệ nổi
        </h1>
        <p className="mt-3 font-body text-sm leading-6 text-on-surface-variant">
          Quản lý slider trung tâm của trang chủ theo style mới. Hero hỗ trợ ảnh
          hoặc video, video tải lên sẽ được nén và lưu local trong codebase. Khi
          thay hoặc xóa video rồi lưu, file local cũ sẽ được dọn để tránh làm
          nặng VPS.
        </p>
      </div>

      {notice ? (
        <AdminNotice message={notice.message} tone={notice.tone} />
      ) : null}

      <section className="border border-outline-variant/40 bg-white p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center bg-primary-fixed text-primary">
            <Mail size={18} />
          </span>
          <div>
            <h2 className="font-headline text-2xl font-black uppercase tracking-tight text-primary">
              Contact nổi
            </h2>
            <p className="font-body text-sm text-on-surface-variant">
              Hai nút mail và số điện thoại ở góc dưới sẽ lấy dữ liệu từ đây.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="inline-flex items-center gap-2 font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
              <Mail size={14} />
              Email liên hệ
            </span>
            <input
              className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
              onChange={handleContactChange("contactEmail")}
              placeholder="sales@woodland.vn"
              type="email"
              value={formData.contactEmail}
            />
          </label>

          <label className="space-y-2">
            <span className="inline-flex items-center gap-2 font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
              <Phone size={14} />
              Số điện thoại
            </span>
            <input
              className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
              onChange={handleContactChange("contactPhone")}
              placeholder="+84 987 654 321"
              type="text"
              value={formData.contactPhone}
            />
          </label>
        </div>
      </section>

      <section className="border border-outline-variant/40 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-headline text-2xl font-black uppercase tracking-tight text-primary">
              Slider media hero
            </h2>
            <p className="mt-2 font-body text-sm text-on-surface-variant">
              Có thể trộn ảnh và video trong cùng slider. Video nên có poster để
              tải nhanh hơn.
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 bg-primary px-4 py-3 font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-primary transition-colors hover:bg-secondary"
            onClick={handleAddSlide}
            type="button"
          >
            <Plus size={14} />
            Thêm slide
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {sortedSlides.map((slide, index) => (
            <article
              key={`${slide.order}-${index}`}
              className="border border-outline-variant/40 bg-surface-container-lowest p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/40 pb-4">
                <div>
                  <p className="font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary">
                    Slide {index + 1}
                  </p>
                  <p className="mt-2 font-body text-sm text-on-surface-variant">
                    Chọn loại media và cập nhật nội dung hiển thị.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    className="inline-flex items-center gap-2 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant hover:border-secondary hover:text-secondary"
                    disabled={index === 0}
                    onClick={() => moveSlide(slide.order, -1)}
                    type="button"
                  >
                    <ArrowUp size={13} />
                    Lên
                  </button>
                  <button
                    className="inline-flex items-center gap-2 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant hover:border-secondary hover:text-secondary"
                    disabled={index === sortedSlides.length - 1}
                    onClick={() => moveSlide(slide.order, 1)}
                    type="button"
                  >
                    <ArrowDown size={13} />
                    Xuống
                  </button>
                  <button
                    className="inline-flex items-center gap-2 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant hover:border-secondary hover:text-secondary"
                    onClick={() =>
                      updateSlide(slide.order, (current) => ({
                        ...current,
                        isVisible: !current.isVisible,
                      }))
                    }
                    type="button"
                  >
                    {slide.isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                    {slide.isVisible ? "Đang hiện" : "Đang ẩn"}
                  </button>
                  <button
                    className="inline-flex items-center gap-2 border border-red-200 px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-red-600 hover:bg-red-50"
                    onClick={() => handleRemoveSlide(slide.order)}
                    type="button"
                  >
                    Gỡ slide
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
                <div className="space-y-3">
                  <button
                    className={`flex w-full items-center gap-3 border px-4 py-3 text-left ${
                      slide.mediaType === "image"
                        ? "border-primary bg-primary-fixed text-primary"
                        : "border-outline-variant bg-white text-on-surface-variant"
                    }`}
                    onClick={() =>
                      updateSlide(slide.order, (current) => ({
                        ...current,
                        mediaType: "image",
                        posterUrl: "",
                      }))
                    }
                    type="button"
                  >
                    <ImageIcon size={16} />
                    Ảnh
                  </button>
                  <button
                    className={`flex w-full items-center gap-3 border px-4 py-3 text-left ${
                      slide.mediaType === "video"
                        ? "border-primary bg-primary-fixed text-primary"
                        : "border-outline-variant bg-white text-on-surface-variant"
                    }`}
                    onClick={() =>
                      updateSlide(slide.order, (current) => ({
                        ...current,
                        mediaType: "video",
                      }))
                    }
                    type="button"
                  >
                    <Video size={16} />
                    Video
                  </button>
                </div>

                <div className="space-y-6">
                  {slide.mediaType === "image" ? (
                    <AdminImageField
                      helperText="Ảnh có thể là URL ngoài hoặc tải lên R2."
                      label="Ảnh nền"
                      onChange={(value) =>
                        updateSlide(slide.order, (current) => ({
                          ...current,
                          mediaUrl: value,
                        }))
                      }
                      value={slide.mediaUrl}
                    />
                  ) : (
                    <div className="grid gap-6 xl:grid-cols-2">
                      <AdminVideoField
                        helperText="Upload video sẽ nén tự động rồi lưu local trong `public/uploads/hero-media`."
                        label="Video hero"
                        onChange={(value) =>
                          updateSlide(slide.order, (current) => ({
                            ...current,
                            mediaUrl: value,
                          }))
                        }
                        value={slide.mediaUrl}
                      />
                      <AdminImageField
                        helperText="Poster giúp video hiển thị mượt hơn trước khi phát."
                        label="Poster video"
                        onChange={(value) =>
                          updateSlide(slide.order, (current) => ({
                            ...current,
                            posterUrl: value,
                          }))
                        }
                        value={slide.posterUrl ?? ""}
                      />
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                        Alt EN
                      </span>
                      <input
                        className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                        onChange={(event) =>
                          updateSlide(slide.order, (current) => ({
                            ...current,
                            alt: { ...current.alt, en: event.target.value },
                          }))
                        }
                        type="text"
                        value={slide.alt.en}
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                        Alt VI
                      </span>
                      <input
                        className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                        onChange={(event) =>
                          updateSlide(slide.order, (current) => ({
                            ...current,
                            alt: { ...current.alt, vi: event.target.value },
                          }))
                        }
                        type="text"
                        value={slide.alt.vi}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border border-outline-variant/40 bg-white p-6">
        <h2 className="font-headline text-2xl font-black uppercase tracking-tight text-primary">
          Chỉ số dưới hero
        </h2>
        <p className="mt-2 font-body text-sm text-on-surface-variant">
          Các chỉ số hiển thị trên dải chân của hero theo style tham chiếu.
        </p>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {sortedStats.map((stat, index) => (
            <article
              key={`${stat.order}-${index}`}
              className="border border-outline-variant/40 bg-surface-container-lowest p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary">
                  Chỉ số {index + 1}
                </p>
                <button
                  className="inline-flex items-center gap-2 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant hover:border-secondary hover:text-secondary"
                  onClick={() =>
                    updateStat(stat.order, (current) => ({
                      ...current,
                      isVisible: !current.isVisible,
                    }))
                  }
                  type="button"
                >
                  {stat.isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                  {stat.isVisible ? "Đang hiện" : "Đang ẩn"}
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Value EN
                  </span>
                  <input
                    className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                    onChange={(event) =>
                      updateStat(stat.order, (current) => ({
                        ...current,
                        value: { ...current.value, en: event.target.value },
                      }))
                    }
                    type="text"
                    value={stat.value.en}
                  />
                </label>
                <label className="space-y-2">
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Value VI
                  </span>
                  <input
                    className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                    onChange={(event) =>
                      updateStat(stat.order, (current) => ({
                        ...current,
                        value: { ...current.value, vi: event.target.value },
                      }))
                    }
                    type="text"
                    value={stat.value.vi}
                  />
                </label>
                <label className="space-y-2">
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Label EN
                  </span>
                  <input
                    className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                    onChange={(event) =>
                      updateStat(stat.order, (current) => ({
                        ...current,
                        label: { ...current.label, en: event.target.value },
                      }))
                    }
                    type="text"
                    value={stat.label.en}
                  />
                </label>
                <label className="space-y-2">
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Label VI
                  </span>
                  <input
                    className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm outline-none transition-colors focus:border-secondary"
                    onChange={(event) =>
                      updateStat(stat.order, (current) => ({
                        ...current,
                        label: { ...current.label, vi: event.target.value },
                      }))
                    }
                    type="text"
                    value={stat.label.vi}
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          className="inline-flex items-center gap-2 bg-primary px-5 py-3 font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-primary transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading || isSaving}
          onClick={() => void handleSave()}
          type="button"
        >
          <Save size={14} />
          {isSaving ? "Đang lưu..." : "Lưu cấu hình"}
        </button>
      </div>
    </div>
  );
}
