"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Save,
  UserRound,
  X,
} from "lucide-react";
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

interface LocalizedText {
  en: string;
  vi: string;
}

interface AdminTeamMember {
  _id: string;
  createdAt?: string;
  email: string;
  image: string;
  isVisible: boolean;
  name: LocalizedText;
  order: number;
  phone: string;
  region: LocalizedText;
  title: LocalizedText;
  updatedAt?: string;
  whatsapp: string;
  zalo: string;
}

interface TeamFormState {
  email: string;
  image: string;
  isVisible: boolean;
  name: LocalizedText;
  order: number;
  phone: string;
  region: LocalizedText;
  title: LocalizedText;
  whatsapp: string;
  zalo: string;
}

interface NoticeState {
  message: string;
  tone: "error" | "success" | "warning";
}

function createEmptyForm(): TeamFormState {
  return {
    email: "",
    image: "",
    isVisible: true,
    name: { en: "", vi: "" },
    order: 0,
    phone: "",
    region: { en: "", vi: "" },
    title: { en: "", vi: "" },
    whatsapp: "",
    zalo: "",
  };
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState<AdminTeamMember[]>([]);
  const [formData, setFormData] = useState<TeamFormState>(createEmptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [priorityDrafts, setPriorityDrafts] = useState<Record<string, number>>({});
  const [savingPriorityId, setSavingPriorityId] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<AdminListSortMode>("created-desc");

  const sortedMembers = useMemo(
    () => sortAdminList(members, sortMode),
    [members, sortMode]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchMembers(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function fetchMembers(showLoading = true) {
    if (showLoading) {
      setIsLoading(true);
    }

    try {
      const response = await fetch("/api/admin/team");

      if (!response.ok) {
        throw new Error(
          await readAdminApiError(response, "Không thể tải đội ngũ kinh doanh.")
        );
      }

      const data = (await response.json()) as AdminTeamMember[];
      setMembers(data);
    } catch (error) {
      setNotice({
        message:
          error instanceof Error
            ? error.message
            : "Không thể tải đội ngũ kinh doanh.",
        tone: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const resetEditor = () => {
    setEditingId(null);
    setFormData(createEmptyForm());
    setIsEditorOpen(false);
  };

  const openCreateEditor = () => {
    setNotice(null);
    setEditingId(null);
    setFormData(createEmptyForm());
    setIsEditorOpen(true);
  };

  const openEditEditor = (member: AdminTeamMember) => {
    setNotice(null);
    setEditingId(member._id);
    setFormData({
      email: member.email ?? "",
      image: member.image ?? "",
      isVisible: member.isVisible ?? true,
      name: {
        en: member.name?.en ?? "",
        vi: member.name?.vi ?? "",
      },
      order: member.order ?? 0,
      phone: member.phone ?? "",
      region: {
        en: member.region?.en ?? "",
        vi: member.region?.vi ?? "",
      },
      title: {
        en: member.title?.en ?? "",
        vi: member.title?.vi ?? "",
      },
      whatsapp: member.whatsapp ?? "",
      zalo: member.zalo ?? "",
    });
    setIsEditorOpen(true);
  };

  const updateLocalizedField = (
    field: "name" | "title" | "region",
    locale: keyof LocalizedText,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: {
        ...current[field],
        [locale]: value,
      },
    }));
  };

  const saveMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setNotice(null);

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/admin/team/${editingId}` : "/api/admin/team";

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
          await readAdminApiError(response, "Không thể lưu nhân sự kinh doanh.")
        );
      }

      await fetchMembers();
      resetEditor();
      setNotice({
        message: editingId
          ? "Đã cập nhật nhân sự kinh doanh."
          : "Đã tạo nhân sự kinh doanh mới.",
        tone: "success",
      });
    } catch (error) {
      setNotice({
        message:
          error instanceof Error
            ? error.message
            : "Không thể lưu nhân sự kinh doanh.",
        tone: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateMember = async (
    memberId: string,
    payload: Partial<TeamFormState>,
    successMessage: string
  ) => {
    setNotice(null);

    try {
      const response = await fetch(`/api/admin/team/${memberId}`, {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error(
          await readAdminApiError(
            response,
            "Không thể cập nhật nhân sự kinh doanh."
          )
        );
      }

      await fetchMembers();
      setNotice({ message: successMessage, tone: "success" });
      return true;
    } catch (error) {
      setNotice({
        message:
          error instanceof Error
            ? error.message
            : "Không thể cập nhật nhân sự kinh doanh.",
        tone: "error",
      });
      return false;
    }
  };

  const getPriorityValue = (member: AdminTeamMember) =>
    priorityDrafts[member._id] ?? member.order ?? 0;

  const isPriorityDirty = (member: AdminTeamMember) =>
    getPriorityValue(member) !== (member.order ?? 0);

  const savePriority = async (member: AdminTeamMember) => {
    const nextPriority = getPriorityValue(member);

    if (nextPriority === (member.order ?? 0)) {
      return;
    }

    setSavingPriorityId(member._id);

    const success = await updateMember(
      member._id,
      { order: nextPriority },
      "Đã lưu thứ tự ưu tiên nhân sự."
    );

    setSavingPriorityId(null);

    if (success) {
      setPriorityDrafts((current) => {
        const nextDrafts = { ...current };
        delete nextDrafts[member._id];
        return nextDrafts;
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border border-outline-variant/40 bg-white p-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">
            Khu vực chăm sóc khách hàng
          </p>
          <div className="flex items-start gap-4">
            <span className="mt-1 flex h-12 w-12 items-center justify-center bg-primary-fixed text-primary">
              <UserRound size={22} />
            </span>
            <div>
              <h1 className="font-headline text-3xl font-black uppercase tracking-tight text-primary">
                Đội ngũ kinh doanh
              </h1>
              <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-on-surface-variant">
                Quản lý nhân sự sales hiển thị ở trang public, gồm hình ảnh, thông tin
                liên hệ, khu vực phụ trách và thứ tự xuất hiện.
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
          Thêm nhân sự
        </button>
      </div>

      {notice ? <AdminNotice message={notice.message} tone={notice.tone} /> : null}

      {isEditorOpen ? (
        <form
          className="space-y-8 border border-outline-variant/40 bg-white p-6"
          onSubmit={saveMember}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">
                {editingId ? "Chỉnh sửa nhân sự" : "Nhân sự mới"}
              </p>
              <h2 className="mt-3 font-headline text-2xl font-black uppercase tracking-tight text-primary">
                {editingId ? "Cập nhật đội ngũ sale" : "Tạo hồ sơ sale mới"}
              </h2>
            </div>

            <button
              className="inline-flex items-center gap-2 border border-outline-variant/40 px-4 py-3 font-label text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
              onClick={resetEditor}
              type="button"
            >
              <X size={15} />
              Đóng
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-5">
              <label className="block space-y-2">
                <span className="font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                  Tên tiếng Việt
                </span>
                <input
                  className="w-full border border-outline-variant/40 px-4 py-3 outline-none transition-colors focus:border-primary"
                  value={formData.name.vi}
                  onChange={(event) =>
                    updateLocalizedField("name", "vi", event.target.value)
                  }
                />
              </label>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                    Tên tiếng Anh
                  </span>
                  <AdminTranslateButton
                    disabled={!formData.name.vi.trim()}
                    fieldLabel="tên nhân sự"
                    onTranslated={(translation) =>
                      updateLocalizedField("name", "en", translation)
                    }
                    sourceValue={formData.name.vi}
                  />
                </div>
                <input
                  className="w-full border border-outline-variant/40 px-4 py-3 outline-none transition-colors focus:border-primary"
                  value={formData.name.en}
                  onChange={(event) =>
                    updateLocalizedField("name", "en", event.target.value)
                  }
                />
              </div>

              <label className="block space-y-2">
                <span className="font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                  Chức danh tiếng Việt
                </span>
                <input
                  className="w-full border border-outline-variant/40 px-4 py-3 outline-none transition-colors focus:border-primary"
                  value={formData.title.vi}
                  onChange={(event) =>
                    updateLocalizedField("title", "vi", event.target.value)
                  }
                />
              </label>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                    Chức danh tiếng Anh
                  </span>
                  <AdminTranslateButton
                    disabled={!formData.title.vi.trim()}
                    fieldLabel="chức danh nhân sự"
                    onTranslated={(translation) =>
                      updateLocalizedField("title", "en", translation)
                    }
                    sourceValue={formData.title.vi}
                  />
                </div>
                <input
                  className="w-full border border-outline-variant/40 px-4 py-3 outline-none transition-colors focus:border-primary"
                  value={formData.title.en}
                  onChange={(event) =>
                    updateLocalizedField("title", "en", event.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-5">
              <label className="block space-y-2">
                <span className="font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                  Khu vực tiếng Việt
                </span>
                <input
                  className="w-full border border-outline-variant/40 px-4 py-3 outline-none transition-colors focus:border-primary"
                  value={formData.region.vi}
                  onChange={(event) =>
                    updateLocalizedField("region", "vi", event.target.value)
                  }
                />
              </label>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                    Khu vực tiếng Anh
                  </span>
                  <AdminTranslateButton
                    disabled={!formData.region.vi.trim()}
                    fieldLabel="khu vực phụ trách"
                    onTranslated={(translation) =>
                      updateLocalizedField("region", "en", translation)
                    }
                    sourceValue={formData.region.vi}
                  />
                </div>
                <input
                  className="w-full border border-outline-variant/40 px-4 py-3 outline-none transition-colors focus:border-primary"
                  value={formData.region.en}
                  onChange={(event) =>
                    updateLocalizedField("region", "en", event.target.value)
                  }
                />
              </div>

              <label className="block space-y-2">
                <span className="font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                  Email
                </span>
                <input
                  className="w-full border border-outline-variant/40 px-4 py-3 outline-none transition-colors focus:border-primary"
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="block space-y-2">
                <span className="font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                  Hotline
                </span>
                <input
                  className="w-full border border-outline-variant/40 px-4 py-3 outline-none transition-colors focus:border-primary"
                  value={formData.phone}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                />
              </label>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1fr_1fr]">
            <label className="block space-y-2">
              <span className="font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                WhatsApp
              </span>
              <input
                className="w-full border border-outline-variant/40 px-4 py-3 outline-none transition-colors focus:border-primary"
                value={formData.whatsapp}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    whatsapp: event.target.value,
                  }))
                }
              />
            </label>

            <label className="block space-y-2">
              <span className="font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                Zalo
              </span>
              <input
                className="w-full border border-outline-variant/40 px-4 py-3 outline-none transition-colors focus:border-primary"
                value={formData.zalo}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    zalo: event.target.value,
                  }))
                }
              />
            </label>

            <label className="block space-y-2">
              <span className="font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                Thứ tự hiển thị
              </span>
              <input
                className="w-full border border-outline-variant/40 px-4 py-3 outline-none transition-colors focus:border-primary"
                type="number"
                value={formData.order}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    order: Number(event.target.value) || 0,
                  }))
                }
              />
            </label>

            <label className="flex items-center gap-3 border border-outline-variant/40 px-4 py-3">
              <input
                type="checkbox"
                checked={formData.isVisible}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    isVisible: event.target.checked,
                  }))
                }
                className="h-4 w-4 accent-primary"
              />
              <span className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                Hiển thị ngoài site
              </span>
            </label>
          </div>

          <AdminImageField
            label="Ảnh nhân sự"
            value={formData.image}
            onChange={(value) =>
              setFormData((current) => ({
                ...current,
                image: value,
              }))
            }
          />

          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-outline-variant/30 pt-6">
            <button
              className="inline-flex items-center gap-2 border border-outline-variant/40 px-5 py-3 font-label text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
              onClick={resetEditor}
              type="button"
            >
              <X size={15} />
              Hủy
            </button>
            <button
              className="inline-flex items-center gap-2 bg-primary px-5 py-3 font-label text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSaving}
              type="submit"
            >
              <Save size={15} />
              {isSaving ? "Đang lưu..." : "Lưu nhân sự"}
            </button>
          </div>
        </form>
      ) : null}

      <div className="border border-outline-variant/40 bg-white">
        <div className="flex flex-col gap-4 border-b border-outline-variant/30 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-headline text-2xl font-black uppercase tracking-tight text-primary">
              Danh sách nhân sự
            </h2>
            <p className="mt-2 font-body text-sm text-on-surface-variant">
              Ưu tiên nhỏ hơn sẽ hiển thị trước ở trang public.
            </p>
          </div>

          <button
            className="inline-flex items-center gap-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:text-secondary"
            onClick={() => setSortMode(getNextPrioritySortMode(sortMode))}
            type="button"
          >
            {sortMode === "priority-desc" ? (
              <>
                <ArrowDown size={14} />
                Ưu tiên giảm dần
              </>
            ) : (
              <>
                <ArrowUp size={14} />
                Ưu tiên tăng dần
              </>
            )}
          </button>
        </div>

        {isLoading ? (
          <div className="px-6 py-12 font-body text-sm text-on-surface-variant">
            Đang tải đội ngũ kinh doanh...
          </div>
        ) : sortedMembers.length === 0 ? (
          <div className="px-6 py-12 font-body text-sm text-on-surface-variant">
            Chưa có nhân sự nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px]">
              <thead>
                <tr className="border-b border-outline-variant/30 bg-surface-container-low">
                  {[
                    "Nhân sự",
                    "Khu vực",
                    "Liên hệ",
                    "Ưu tiên",
                    "Trạng thái",
                    "Cập nhật",
                    "Thao tác",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-4 text-left font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedMembers.map((member) => (
                  <tr key={member._id} className="border-b border-outline-variant/20">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 overflow-hidden border border-outline-variant/30 bg-surface-container-low">
                          {member.image ? (
                            <AdminImageFieldPreview src={member.image} alt={member.name.vi || member.name.en} />
                          ) : null}
                        </div>
                        <div>
                          <p className="font-body text-sm font-semibold text-primary">
                            {member.name.vi || member.name.en}
                          </p>
                          <p className="mt-1 font-body text-xs text-on-surface-variant">
                            {member.title.vi || member.title.en}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-body text-sm text-on-surface-variant">
                      {member.region.vi || member.region.en || "—"}
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1 font-body text-sm text-on-surface-variant">
                        <p>{member.phone || "—"}</p>
                        <p>{member.email || "—"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <AdminPriorityInput
                        isDirty={isPriorityDirty(member)}
                        isSaving={savingPriorityId === member._id}
                        onChange={(value) =>
                          setPriorityDrafts((current) => ({
                            ...current,
                            [member._id]: value,
                          }))
                        }
                        onSave={() => void savePriority(member)}
                        value={getPriorityValue(member)}
                      />
                    </td>
                    <td className="px-6 py-5">
                      <button
                        className={`inline-flex items-center gap-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                          member.isVisible
                            ? "text-secondary hover:text-primary"
                            : "text-outline hover:text-primary"
                        }`}
                        onClick={() =>
                          void updateMember(
                            member._id,
                            { isVisible: !member.isVisible },
                            member.isVisible
                              ? "Đã ẩn nhân sự khỏi website."
                              : "Đã hiển thị nhân sự trên website."
                          )
                        }
                        type="button"
                      >
                        {member.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                        {member.isVisible ? "Đang hiện" : "Đang ẩn"}
                      </button>
                    </td>
                    <td className="px-6 py-5 font-body text-sm text-on-surface-variant">
                      {formatAdminDate(member.updatedAt || member.createdAt)}
                    </td>
                    <td className="px-6 py-5">
                      <button
                        className="inline-flex items-center gap-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:text-secondary"
                        onClick={() => openEditEditor(member)}
                        type="button"
                      >
                        <Pencil size={14} />
                        Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminImageFieldPreview({ alt, src }: { alt: string; src: string }) {
  return (
    <Image alt={alt} className="object-cover" fill src={src} />
  );
}
