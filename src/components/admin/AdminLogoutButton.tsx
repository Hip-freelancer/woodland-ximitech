"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = () => {
    setIsSubmitting(true);

    void (async () => {
      try {
        await fetch("/api/admin/logout", {
          method: "POST",
        });
      } finally {
        router.replace("/admin/login");
        router.refresh();
        setIsSubmitting(false);
      }
    })();
  };

  return (
    <button
      className="inline-flex items-center gap-2 border border-outline-variant px-4 py-2 font-label text-[11px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isSubmitting}
      onClick={handleLogout}
      type="button"
    >
      <LogOut size={14} />
      {isSubmitting ? "Đang thoát..." : "Đăng xuất"}
    </button>
  );
}
