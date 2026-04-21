"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, LogIn, ShieldCheck } from "lucide-react";

interface AdminLoginFormProps {
  nextPath: string;
}

export default function AdminLoginForm({ nextPath }: AdminLoginFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    void (async () => {
      try {
        const response = await fetch("/api/admin/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            next: nextPath,
            password,
            username,
          }),
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          setErrorMessage(
            result?.error ?? "Đăng nhập thất bại. Vui lòng thử lại."
          );
          return;
        }

        router.replace(result?.next ?? "/admin");
        router.refresh();
      } catch {
        setErrorMessage("Không thể kết nối tới máy chủ xác thực.");
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  return (
    <div className="relative overflow-hidden bg-surface min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(47,122,83,0.18),_transparent_36%),radial-gradient(circle_at_bottom_left,_rgba(31,111,58,0.18),_transparent_32%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grain-overlay relative overflow-hidden border border-outline-variant/40 bg-primary px-8 py-10 text-white lg:px-10">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_52%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between gap-10">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 border border-white/20 px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-primary-fixed">
                  <ShieldCheck size={14} />
                  Woodland Admin Access
                </span>
                <div className="space-y-4">
                  <h1 className="max-w-xl font-headline text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
                    Đăng nhập khu vực quản trị.
                  </h1>
                  <p className="max-w-xl font-body text-base leading-7 text-white/76">
                    Quản lý nội dung sản phẩm, danh mục, bài viết và dữ liệu liên hệ
                    trong cùng một không gian vận hành.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  "Biểu mẫu quản trị có phản hồi trực tiếp trong giao diện.",
                  "Phiên đăng nhập dùng cookie HTTP-only.",
                  "Danh sách nội dung hỗ trợ ưu tiên và ẩn hiện.",
                ].map((item) => (
                  <div
                    key={item}
                    className="border border-white/14 bg-white/8 p-4 font-body text-sm leading-6 text-white/76 backdrop-blur-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border border-outline-variant/40 bg-white p-8 shadow-[0_28px_80px_rgba(17,56,35,0.08)] lg:p-10">
            <div className="mb-10 space-y-3">
              <p className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">
                Secure Session
              </p>
              <h2 className="font-headline text-3xl font-black uppercase tracking-tight text-primary">
                Admin Login
              </h2>
              <p className="font-body text-sm leading-6 text-on-surface-variant">
                Sử dụng tài khoản admin đã cấu hình trong môi trường hệ thống.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Username
                </span>
                <input
                  autoComplete="username"
                  className="w-full border border-outline-variant bg-surface px-4 py-3 font-body text-sm text-on-surface outline-none transition-colors focus:border-secondary"
                  disabled={isSubmitting}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="admin"
                  required
                  value={username}
                />
              </label>

              <label className="block space-y-2">
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Password
                </span>
                <div className="flex items-center border border-outline-variant bg-surface focus-within:border-secondary">
                  <span className="pl-4 text-on-surface-variant">
                    <LockKeyhole size={16} />
                  </span>
                  <input
                    autoComplete="current-password"
                    className="w-full bg-transparent px-4 py-3 font-body text-sm text-on-surface outline-none"
                    disabled={isSubmitting}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    required
                    type="password"
                    value={password}
                  />
                </div>
              </label>

              {errorMessage ? (
                <div className="border border-error/20 bg-error-container px-4 py-3 font-body text-sm text-on-error-container">
                  {errorMessage}
                </div>
              ) : null}

              <button
                className="inline-flex w-full items-center justify-center gap-2 bg-primary px-5 py-4 font-label text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:bg-primary/60"
                disabled={isSubmitting}
                type="submit"
              >
                <LogIn size={15} />
                {isSubmitting ? "Đang xác thực..." : "Đăng nhập"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
