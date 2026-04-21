"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCheck, Clock3, MailOpen, MessageSquare } from "lucide-react";
import AdminNotice from "@/components/admin/AdminNotice";
import { formatAdminDate, readAdminApiError } from "@/lib/adminClient";

type ContactStatus = "new" | "read" | "replied";

interface AdminContact {
  _id: string;
  company?: string;
  email: string;
  fullName: string;
  message: string;
  phone?: string;
  status: ContactStatus;
  submittedAt: string;
}

interface NoticeState {
  message: string;
  tone: "error" | "success" | "warning";
}

const statusConfig: Record<
  ContactStatus,
  { className: string; label: string }
> = {
  new: {
    className: "bg-primary-fixed text-on-primary-fixed",
    label: "Mới",
  },
  read: {
    className: "bg-surface-container text-on-surface-variant",
    label: "Đã đọc",
  },
  replied: {
    className: "bg-secondary-fixed text-on-secondary-fixed",
    label: "Đã phản hồi",
  },
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<AdminContact[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState<NoticeState | null>(null);

  async function fetchContacts(showLoading = true) {
    if (showLoading) {
      setIsLoading(true);
    }

    try {
      const response = await fetch("/api/admin/contacts");

      if (!response.ok) {
        throw new Error(
          await readAdminApiError(response, "Không thể tải liên hệ.")
        );
      }

      const data = (await response.json()) as AdminContact[];
      setContacts(data);
      setSelectedId((current) => current ?? data[0]?._id ?? null);
    } catch (error) {
      setNotice({
        message:
          error instanceof Error ? error.message : "Không thể tải liên hệ.",
        tone: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchContacts(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const selectedContact = useMemo(
    () => contacts.find((contact) => contact._id === selectedId) ?? null,
    [contacts, selectedId]
  );

  const updateStatus = async (contactId: string, status: ContactStatus) => {
    setNotice(null);

    try {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        body: JSON.stringify({ status }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error(
          await readAdminApiError(response, "Không thể cập nhật liên hệ.")
        );
      }

      await fetchContacts();
      setSelectedId(contactId);
      setNotice({
        message: "Đã cập nhật trạng thái liên hệ.",
        tone: "success",
      });
    } catch (error) {
      setNotice({
        message:
          error instanceof Error
            ? error.message
            : "Không thể cập nhật liên hệ.",
        tone: "error",
      });
    }
  };

  const newContacts = contacts.filter((contact) => contact.status === "new").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border border-outline-variant/40 bg-white p-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">
            Quản lý hộp thư
          </p>
          <div className="flex items-start gap-4">
            <span className="mt-1 flex h-12 w-12 items-center justify-center bg-primary-fixed text-primary">
              <MessageSquare size={22} />
            </span>
            <div>
              <h1 className="font-headline text-3xl font-black uppercase tracking-tight text-primary">
                Liên hệ
              </h1>
              <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-on-surface-variant">
                Theo dõi yêu cầu mới từ form liên hệ, chuyển trạng thái xử lý và đọc
                nhanh nội dung thư ngay trong admin.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Tổng liên hệ", value: contacts.length },
            { label: "Liên hệ mới", value: newContacts },
            {
              label: "Đã phản hồi",
              value: contacts.filter((contact) => contact.status === "replied").length,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="border border-outline-variant/40 bg-surface-container-low px-4 py-4"
            >
              <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                {item.label}
              </p>
              <p className="mt-2 font-headline text-3xl font-black text-primary">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {notice ? <AdminNotice message={notice.message} tone={notice.tone} /> : null}

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden border border-outline-variant/40 bg-white">
          <table className="min-w-full divide-y divide-outline-variant/40">
            <thead className="bg-surface-container-low">
              <tr>
                {["Người gửi", "Email", "Trạng thái", "Gửi lúc"].map((heading) => (
                  <th
                    key={heading}
                    className="px-6 py-4 text-left font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {isLoading ? (
                <tr>
                  <td
                    className="px-6 py-10 text-center font-body text-sm text-on-surface-variant"
                    colSpan={4}
                  >
                    Đang tải liên hệ...
                  </td>
                </tr>
              ) : null}

              {!isLoading && contacts.length === 0 ? (
                <tr>
                  <td
                    className="px-6 py-10 text-center font-body text-sm text-on-surface-variant"
                    colSpan={4}
                  >
                    Chưa có liên hệ nào.
                  </td>
                </tr>
              ) : null}

              {!isLoading
                ? contacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className={`cursor-pointer transition-colors hover:bg-surface-container-low/70 ${
                        selectedId === contact._id ? "bg-surface-container-low" : ""
                      }`}
                      onClick={() => setSelectedId(contact._id)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-body text-sm font-semibold text-on-surface">
                          {contact.fullName}
                        </div>
                        <div className="mt-1 font-body text-xs text-on-surface-variant">
                          {contact.company || "Không có công ty"}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-body text-sm text-on-surface-variant">
                        {contact.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] ${statusConfig[contact.status].className}`}
                        >
                          {statusConfig[contact.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-body text-sm text-on-surface-variant">
                        {formatAdminDate(contact.submittedAt)}
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>

        <div className="border border-outline-variant/40 bg-white p-6">
          {selectedContact ? (
            <div className="space-y-6">
              <div className="space-y-3 border-b border-outline-variant/30 pb-6">
                <p className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">
                  Chi tiết liên hệ
                </p>
                <h2 className="font-headline text-2xl font-black uppercase tracking-tight text-primary">
                  {selectedContact.fullName}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <a
                    className="inline-flex items-center gap-2 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary"
                    href={`mailto:${selectedContact.email}`}
                  >
                    <MailOpen size={14} />
                    {selectedContact.email}
                  </a>
                  {selectedContact.phone ? (
                    <a
                      className="inline-flex items-center gap-2 border border-outline-variant px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary"
                      href={`tel:${selectedContact.phone}`}
                    >
                      <Clock3 size={14} />
                      {selectedContact.phone}
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border border-outline-variant/30 bg-surface px-4 py-4">
                  <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Công ty
                  </p>
                  <p className="mt-2 font-body text-sm text-on-surface">
                    {selectedContact.company || "Không cung cấp"}
                  </p>
                </div>
                <div className="border border-outline-variant/30 bg-surface px-4 py-4">
                  <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Gửi lúc
                  </p>
                  <p className="mt-2 font-body text-sm text-on-surface">
                    {formatAdminDate(selectedContact.submittedAt)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Nội dung
                </p>
                <div className="border border-outline-variant/30 bg-surface px-4 py-4 font-body text-sm leading-7 text-on-surface">
                  {selectedContact.message}
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Chuyển trạng thái
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <button
                    className="inline-flex items-center justify-center gap-2 border border-outline-variant px-4 py-3 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                    onClick={() => void updateStatus(selectedContact._id, "new")}
                    type="button"
                  >
                    <Clock3 size={14} />
                    Đánh dấu mới
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-2 border border-outline-variant px-4 py-3 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                    onClick={() => void updateStatus(selectedContact._id, "read")}
                    type="button"
                  >
                    <MailOpen size={14} />
                    Đánh dấu đã đọc
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-3 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-secondary"
                    onClick={() => void updateStatus(selectedContact._id, "replied")}
                    type="button"
                  >
                    <CheckCheck size={14} />
                    Đã phản hồi
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[420px] items-center justify-center border border-dashed border-outline-variant/40 bg-surface px-6 text-center font-body text-sm text-on-surface-variant">
              Chọn một liên hệ trong bảng để xem nội dung chi tiết.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
