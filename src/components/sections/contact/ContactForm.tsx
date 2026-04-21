"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ fullName: "", email: "", phone: "", company: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="py-16 text-center">
        <h3 className="font-headline font-bold text-2xl uppercase text-primary mb-3">
          {t("successTitle")}
        </h3>
        <p className="font-body text-base text-on-surface-variant">{t("successMessage")}</p>
      </div>
    );
  }

  const inputClass =
    "w-full bg-transparent border-b border-surface-variant py-3 font-body text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary transition-colors duration-300";

  const fields = [
    { name: "fullName", label: t("fullName"), type: "text" },
    { name: "email", label: t("workEmail"), type: "email" },
    { name: "phone", label: t("phone"), type: "tel" },
    { name: "company", label: t("company"), type: "text" },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {fields.map(({ name, label, type }) => (
          <div key={name}>
            <label className="block font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant mb-2">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={label}
              className={inputClass}
              required={name === "fullName" || name === "email"}
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant mb-2">
          {t("message")}
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder={t("message")}
          rows={5}
          required
          className={inputClass + " resize-none"}
        />
      </div>

      {status === "error" && (
        <p className="font-body text-sm text-error">{t("errorMessage")}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex items-center gap-2 bg-primary text-on-primary font-label text-xs font-semibold uppercase tracking-widest px-8 py-4 hover:bg-secondary transition-colors duration-300 disabled:opacity-50"
      >
        {status === "loading" ? t("submitting") : t("submit")}
        <ArrowRight size={14} />
      </button>
    </form>
  );
}
