"use client";

import { useEffect, useState } from "react";
import {
  Boxes,
  FolderOpen,
  MessageSquare,
  Newspaper,
  Users,
} from "lucide-react";
import AdminNotice from "@/components/admin/AdminNotice";

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
    </div>
  );
}
