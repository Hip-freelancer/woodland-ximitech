import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative -mt-16 h-screen w-full flex items-center overflow-hidden grain-overlay bg-[#331917]">
      <div className="absolute inset-0 z-0">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgpQsbpTCwV4LyLR3wUmZMrCqqa-8MxMPH9NAS-Ow7UAUemrfekRrw8rGgQOOyLfdmg30atCDlFptpFvBuQuBAe5owO56XYqL-7V6ZIgXMFi8K4kMih6kfiWopuCFoAY_nLkNJCTdX4VR5UMFgxVsXb7RE9NADzWRTiK0gjmZ96zynKIg6uUCKLb8X-KeKE8OeeaYnGhW0XuBGLiHoNiaJvUSjh5rVPMHa7MfoKhh4wQzOFdR2SlzJCFxf7SI7ju6XInC1EJQK-5RB"
          alt="Premium Wood Texture"
          className="w-full h-full object-cover opacity-60 mix-blend-multiply"
        />
      </div>
      <div className="relative z-10 max-w-[1440px] mx-auto px-12 w-full pt-14 md:pt-16">
        <div className="max-w-4xl">
          <span className="inline-block px-3 py-1 bg-[#396759] text-white font-label text-[10px] uppercase tracking-[0.2em] mb-8">
            Industrial Excellence
          </span>
          <h1 className="font-headline font-black text-6xl md:text-8xl text-[#fbf9f8] uppercase leading-[0.9] tracking-tighter mb-8">
            {t("title")}
          </h1>
          <p className="font-body text-xl text-[#be9590] max-w-2xl mb-12 font-light leading-relaxed">
            {t("subtitle")}
          </p>
          <div className="flex flex-wrap gap-6">
            <Link
              href="/products"
              className="flex items-center gap-2 bg-[#fbf9f8] text-[#331917] px-10 py-5 font-headline font-bold uppercase text-sm tracking-widest hover:bg-[#396759] hover:text-white transition-all duration-500 ease-out"
            >
              {t("viewProducts")}
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/about"
              className="border border-[#827472] text-[#fbf9f8] px-10 py-5 font-headline font-bold uppercase text-sm tracking-widest hover:bg-white/10 transition-all duration-500"
            >
              {t("ourProcess")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
