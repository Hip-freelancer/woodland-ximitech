"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Admin UI
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const navItems = [
  { name: "Trang chủ", href: "/admin/home-settings" },
  { name: "Sản phẩm", href: "/admin/products" },
  { name: "Danh mục", href: "/admin/categories" },
  { name: "Bài viết (Tin tức)", href: "/admin/news" },
  { name: "Đội ngũ kinh doanh", href: "/admin/team" },
  { name: "Liên hệ", href: "/admin/contacts" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-surface-container-low">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-72 flex-col overflow-y-auto bg-primary p-6 text-white">
        <h1 className="mb-10 font-headline text-2xl font-black tracking-widest uppercase">
          Quản Trị <span className="text-primary-fixed">Woodland</span>
        </h1>

        <nav className="flex flex-1 flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className={`border px-4 py-3 font-medium transition-colors ${
                pathname === item.href
                  ? "border-primary-fixed bg-primary-container text-white"
                  : "border-white/10 bg-white/5 hover:bg-white/10 text-white/86"
              }`}
              href={item.href}
            >
              {item.name}
            </Link>
          ))}

          <Link
            className="mt-auto flex items-center gap-2 px-4 py-3 font-medium text-white/60 hover:text-white"
            href="/"
          >
            ← Trở về trang web
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen pl-72">
        <header className="flex items-center justify-between border-b border-outline-variant/40 bg-white p-6">
          <div>
            <h2 className="font-headline text-xl font-black uppercase tracking-tight text-primary">
              Khu vực quản lý
            </h2>
            <div className="text-sm text-on-surface-variant">
              Đăng nhập với quyền Admin
            </div>
          </div>
          <AdminLogoutButton />
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
