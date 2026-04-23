"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  Boxes,
  Download,
  FolderOpen,
  HardDriveUpload,
  MessageSquare,
  Newspaper,
  Users,
} from "lucide-react";
import AdminNotice from "@/components/admin/AdminNotice";
import {
  exportAdminBackup,
  importAdminBackupData,
  type AdminBackupPayload,
} from "@/lib/adminClient";

interface DashboardStats {
  categories: number;
  contacts: number;
  news: number;
  products: number;
  team: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    categories: 0,
    contacts: 0,
    news: 0,
    products: 0,
    team: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isExportingBackup, setIsExportingBackup] = useState(false);
  const [isImportingBackup, setIsImportingBackup] = useState(false);
  const [backupNotice, setBackupNotice] = useState("");
  const importInputRef = useRef<HTMLInputElement>(null);

  async function fetchDashboardStats(showLoading = true) {
    if (showLoading) {
      setIsLoading(true);
      setErrorMessage("");
    }

    try {
      const [
        productsResponse,
        categoriesResponse,
        newsResponse,
        contactsResponse,
        teamResponse,
      ] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/news"),
        fetch("/api/admin/contacts"),
        fetch("/api/admin/team"),
      ]);

      if (
        !productsResponse.ok ||
        !categoriesResponse.ok ||
        !newsResponse.ok ||
        !contactsResponse.ok ||
        !teamResponse.ok
      ) {
        throw new Error("Không thể tải số liệu tổng quan.");
      }

      const [products, categories, news, contacts, team] = await Promise.all([
        productsResponse.json(),
        categoriesResponse.json(),
        newsResponse.json(),
        contactsResponse.json(),
        teamResponse.json(),
      ]);

      setStats({
        categories: categories.length,
        contacts: contacts.length,
        news: news.length,
        products: products.length,
        team: team.length,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể tải số liệu tổng quan.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchDashboardStats(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleExportBackup = async () => {
    setBackupNotice("");
    setIsExportingBackup(true);

    try {
      const backup = await exportAdminBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: "application/json",
      });
      const downloadUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const dateKey = backup.exportedAt.slice(0, 10);

      anchor.href = downloadUrl;
      anchor.download = `woodland-admin-backup-${dateKey}.json`;
      anchor.click();
      URL.revokeObjectURL(downloadUrl);

      setBackupNotice("Đã xuất file backup dữ liệu quản trị.");
    } catch (error) {
      setBackupNotice(
        error instanceof Error
          ? error.message
          : "Không thể xuất dữ liệu backup."
      );
    } finally {
      setIsExportingBackup(false);
    }
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!window.confirm("Import sẽ thay thế toàn bộ dữ liệu quản trị hiện tại. Tiếp tục?")) {
      event.target.value = "";
      return;
    }

    setBackupNotice("");
    setIsImportingBackup(true);

    try {
      const rawContent = await file.text();
      const payload = JSON.parse(rawContent) as AdminBackupPayload;

      await importAdminBackupData(payload);
      await fetchDashboardStats();
      setBackupNotice("Đã nhập backup và thay thế toàn bộ dữ liệu quản trị.");
    } catch (error) {
      setBackupNotice(
        error instanceof Error
          ? error.message
          : "Không thể nhập dữ liệu backup."
      );
    } finally {
      setIsImportingBackup(false);
      event.target.value = "";
    }
  };

  const cards = [
    {
      icon: <Boxes size={20} />,
      label: "Sản phẩm",
      value: stats.products,
    },
    {
      icon: <FolderOpen size={20} />,
      label: "Danh mục",
      value: stats.categories,
    },
    {
      icon: <Newspaper size={20} />,
      label: "Bài viết",
      value: stats.news,
    },
    {
      icon: <Users size={20} />,
      label: "Đội ngũ sale",
      value: stats.team,
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Liên hệ",
      value: stats.contacts,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="border border-outline-variant/40 bg-white p-6">
        <p className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">
          Bảng điều khiển
        </p>
        <h1 className="mt-3 font-headline text-3xl font-black uppercase tracking-tight text-primary">
          Tổng quan quản trị
        </h1>
        <p className="mt-3  font-body text-sm leading-6 text-on-surface-variant">
          Theo dõi nhanh số lượng nội dung đang quản lý và chuyển sang các khu
          vực sản phẩm, danh mục, bài viết hoặc liên hệ để thao tác chi tiết.
        </p>
      </div>

      {errorMessage ? (
        <AdminNotice message={errorMessage} tone="error" />
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="border border-outline-variant/40 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center bg-primary-fixed text-primary">
                {card.icon}
              </span>
              <span className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                {isLoading ? "Đang tải" : "Sẵn sàng"}
              </span>
            </div>
            <p className="mt-5 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
              {card.label}
            </p>
            <p className="mt-2 font-headline text-4xl font-black text-primary">
              {isLoading ? "..." : card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="border border-outline-variant/40 bg-primary px-6 py-8 text-white">
        <h2 className="font-headline text-2xl font-black uppercase tracking-tight">
          Ghi chú vận hành
        </h2>
        <p className="mt-3  font-body text-sm leading-7 text-white/78">
          Các thao tác trong admin hiện đã hỗ trợ chỉnh sửa trực tiếp, bật tắt
          hiển thị và thay đổi độ ưu tiên cho nội dung chính. Trình soạn thảo
          ảnh cũng đã bỏ `alert` và hiển thị lỗi ngay trong giao diện.
        </p>
      </div>

      <div className="border border-outline-variant/40 bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">
              Sao lưu dữ liệu
            </p>
            <h2 className="mt-3 font-headline text-2xl font-black uppercase tracking-tight text-primary">
              Xuất / nhập JSON
            </h2>
            <p className="mt-3 max-w-3xl font-body text-sm leading-6 text-on-surface-variant">
              Backup gồm sản phẩm, bài viết, danh mục, liên hệ, đội ngũ,
              projects và cấu hình trang chủ. Video hero local sẽ không được
              đóng gói trong file export.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="inline-flex items-center gap-2 border border-outline-variant px-4 py-3 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isExportingBackup || isImportingBackup}
              onClick={() => void handleExportBackup()}
              type="button"
            >
              <Download size={14} />
              {isExportingBackup ? "Đang xuất..." : "Xuất backup"}
            </button>

            <button
              className="inline-flex items-center gap-2 bg-primary px-4 py-3 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isExportingBackup || isImportingBackup}
              onClick={() => importInputRef.current?.click()}
              type="button"
            >
              <HardDriveUpload size={14} />
              {isImportingBackup ? "Đang nhập..." : "Nhập backup"}
            </button>
          </div>
        </div>

        <input
          accept="application/json"
          className="hidden"
          onChange={(event) => void handleImportFile(event)}
          ref={importInputRef}
          type="file"
        />

        {backupNotice ? (
          <div className="mt-5">
            <AdminNotice
              message={backupNotice}
              tone={
                backupNotice.startsWith("Đã ")
                  ? "success"
                  : "error"
              }
            />
          </div>
        ) : null}

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="border border-outline-variant/40 bg-surface-container-low px-4 py-4">
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
              Lưu ý
            </p>
            <p className="mt-2 font-body text-sm leading-6 text-on-surface-variant">
              Import sẽ thay thế toàn bộ dữ liệu hiện có trong admin.
            </p>
          </div>
          <div className="border border-outline-variant/40 bg-surface-container-low px-4 py-4">
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
              Ảnh domain cũ
            </p>
            <p className="mt-2 font-body text-sm leading-6 text-on-surface-variant">
              URL ảnh `https://woodland.vn/` sẽ được tải lại lên R2 trong lúc
              lưu hoặc import.
            </p>
          </div>
          <div className="border border-outline-variant/40 bg-surface-container-low px-4 py-4">
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
              Script một lần
            </p>
            <p className="mt-2 font-body text-sm leading-6 text-on-surface-variant">
              Có sẵn `npm run migrate:categories` và
              `npm run backfill:legacy-images` để chuẩn hóa dữ liệu hiện tại.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
