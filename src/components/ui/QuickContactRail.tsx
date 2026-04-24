"use client";

import { useSyncExternalStore } from "react";
import { Mail, PhoneCall, X } from "lucide-react";
import { COMPANY_INFO } from "@/lib/companyInfo";
import type { HomeSettings, Locale } from "@/types";

const QUICK_CONTACT_STORAGE_KEY = "woodland.quick-contact.open";
const QUICK_CONTACT_EVENT = "woodland:quick-contact-change";

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => onStoreChange();

  window.addEventListener("storage", handleChange);
  window.addEventListener(QUICK_CONTACT_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(QUICK_CONTACT_EVENT, handleChange);
  };
}

function getClientSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  const savedValue = window.localStorage.getItem(QUICK_CONTACT_STORAGE_KEY);
  return savedValue === "true";
}

function getServerSnapshot() {
  return false;
}

function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.024 4.388 11.018 10.125 11.927v-8.437H7.078v-3.49h3.047V9.413c0-3.03 1.792-4.706 4.533-4.706 1.313 0 2.686.236 2.686.236v2.974h-1.514c-1.49 0-1.956.931-1.956 1.887v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.091 24 18.097 24 12.073Z" />
    </svg>
  );
}

function ContactActionButton({
  ariaLabel,
  children,
  href,
  label,
  target,
  title,
}: {
  ariaLabel: string;
  children: React.ReactNode;
  href: string;
  label: string;
  target?: "_blank";
  title: string;
}) {
  return (
    <a
      aria-label={ariaLabel}
      className="group flex min-h-[56px] max-w-[calc(100vw-1.5rem)] items-center gap-3 rounded-[20px] bg-white/97 px-3.5 py-2 shadow-[0_14px_34px_rgba(7,24,14,0.16)] ring-1 ring-black/5 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(7,24,14,0.22)] md:min-h-[62px] md:max-w-none md:rounded-[22px] md:px-4 md:py-2.5"
      href={href}
      rel={target === "_blank" ? "noreferrer" : undefined}
      target={target}
      title={title}
    >
      {children}
      <span className="max-w-[190px] truncate pr-1 text-left font-label text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-700 sm:max-w-[220px] sm:text-[11px] sm:tracking-[0.18em]">
        {label}
      </span>
    </a>
  );
}

export default function QuickContactRail({
  locale,
  settings,
}: {
  locale: Locale;
  settings: HomeSettings;
}) {
  const contactOpen = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );
  const quickContactEmail = COMPANY_INFO.email;

  const toggleContactOpen = () => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        QUICK_CONTACT_STORAGE_KEY,
        String(!contactOpen)
      );
      window.dispatchEvent(new Event(QUICK_CONTACT_EVENT));
    } catch {
      // Ignore storage write errors to avoid breaking UI.
    }
  };

  return (
    <div className="fixed bottom-5 right-3 z-[70] flex flex-col items-end gap-2.5 md:bottom-8 md:right-5">
      <div
        className={`mb-1 flex flex-col items-end gap-2.5 transition-all duration-300 ease-out ${
          contactOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-2 scale-95 opacity-0"
        }`}
      >
        <div
          className={`transition-all duration-300 ease-out ${
            contactOpen ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"
          }`}
          style={{ transitionDelay: contactOpen ? "0ms" : "120ms" }}
        >
          <ContactActionButton
            ariaLabel="Facebook Woodland"
            href={COMPANY_INFO.facebook}
            label="Facebook"
            target="_blank"
            title="Facebook Woodland"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#1877F2] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] md:h-12 md:w-12 md:rounded-[16px]">
              <FacebookIcon className="h-5 w-5 md:h-6 md:w-6" />
            </span>
          </ContactActionButton>
        </div>

        {quickContactEmail ? (
          <div
            className={`transition-all duration-300 ease-out ${
              contactOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-3 opacity-0"
            }`}
            style={{ transitionDelay: contactOpen ? "40ms" : "80ms" }}
          >
            <ContactActionButton
              ariaLabel={quickContactEmail}
              href={`mailto:${quickContactEmail}`}
              label={quickContactEmail}
              title={quickContactEmail}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#F44336] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] md:h-12 md:w-12 md:rounded-[16px]">
                <Mail size={20} className="md:h-[22px] md:w-[22px]" />
              </span>
            </ContactActionButton>
          </div>
        ) : null}

        {settings.contactPhone ? (
          <div
            className={`transition-all duration-300 ease-out ${
              contactOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-3 opacity-0"
            }`}
            style={{ transitionDelay: contactOpen ? "80ms" : "40ms" }}
          >
            <ContactActionButton
              ariaLabel={settings.contactPhone}
              href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}
              label={settings.contactPhone}
              title={settings.contactPhone}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#16A34A] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] md:h-12 md:w-12 md:rounded-[16px]">
                <PhoneCall size={20} className="md:h-[22px] md:w-[22px]" />
              </span>
            </ContactActionButton>
          </div>
        ) : null}

        {COMPANY_INFO.secondaryPhone ? (
          <div
            className={`transition-all duration-300 ease-out ${
              contactOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-3 opacity-0"
            }`}
            style={{ transitionDelay: contactOpen ? "120ms" : "0ms" }}
          >
            <ContactActionButton
              ariaLabel={COMPANY_INFO.secondaryPhone}
              href={`tel:${COMPANY_INFO.secondaryPhone.replace(/\s+/g, "")}`}
              label={COMPANY_INFO.secondaryPhone}
              title={COMPANY_INFO.secondaryPhone}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#10B981] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] md:h-12 md:w-12 md:rounded-[16px]">
                <PhoneCall size={20} className="md:h-[22px] md:w-[22px]" />
              </span>
            </ContactActionButton>
          </div>
        ) : null}
      </div>

      <button
        aria-label={
          locale === "vi" ? "Mở hoặc đóng liên hệ nhanh" : "Toggle quick contact"
        }
        className={`flex items-center justify-center gap-3 bg-primary text-white shadow-[0_18px_42px_rgba(18,55,31,0.24)] ring-4 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary ${
          contactOpen
            ? "h-[64px] w-[64px] rounded-[22px] md:h-[72px] md:w-[72px] md:rounded-[24px]"
            : "min-h-[56px] rounded-full px-5 py-3 md:min-h-[60px] md:px-6"
        }`}
        onClick={toggleContactOpen}
        type="button"
      >
        {contactOpen ? (
          <X size={28} className="md:h-[34px] md:w-[34px]" />
        ) : (
          <>
            <PhoneCall size={20} className="md:h-[22px] md:w-[22px]" />
            <span className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] md:text-[11px]">
              {locale === "vi" ? "Liên hệ" : "Contact us"}
            </span>
          </>
        )}
      </button>
    </div>
  );
}
