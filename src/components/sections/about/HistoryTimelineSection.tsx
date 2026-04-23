import Image from "next/image";
import { useTranslations } from "next-intl";

const galleryImages = [
  {
    key: "warehouse",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDI2hGXUi0ar6R1YdGBVByYkkyEg61Zf7PtN7NAySiLt5CeVYiXqCqkQLm3ehNaLJWbub4zlD5Xy9mgB7KKhjxGIZnlf0dLGxOhERXH3b7jFMqXY8BGuZ0uUWez76H9NvBK2bWbZQVGLEl1OqUUn_zLs5HP-gBqhnnZkDcWQtXE4eOEp05JUav0COCt3gYBqTmeemmDM9FL6AY3tpRR2mWdTOtq2uHs8Lpu7ezv-1sCH0I2xb5hXJA6L8tIxSBZuPAdOcoFNV3gJ6Cr",
  },
  {
    key: "product",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBX_A_FkU1yiAYYPdpxLINnFEPmPwNi63SHjtJg3ss6P3RpsS4IgfCcWyuZu7P3lsu9sfZGNp0xZeIQIAzf_F_1iPbXVTG6tHqpfYVm9paP35hrG3YBr3O-uWV9sY2auEw52DRqldixhIPkhlD5uY0vkt4t5zDJEW9lZDvKpdq5X2L0hQShx6OtxuDAchV85xB-idssSkbj-HLkZEkyqN16uVhzLWgBMRLS-coI4LMQ_5yL9dztIGFhHdAFen5kgMmnqaF0rHlnEG8n",
  },
  {
    key: "team",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCa-XGKrwtgZlDj2laoH2DsjfoXq3XNqZTLcGBvALocxLxmoNmBwz4ee3XkYOq8Wy854wWOdMjsm8TJvZhHNpUp4SoRznwV5kQwV6SAfUytP53EOZjJANxvnFv7jCpDwH6BYgowKgfbKABPgb6MIBoBr2imrvIydPVVfS_gF3ZRITc7-hXjyGg5EXiuDSRadtN_GSeUI87uVCdivb6XfSz2mpGFjxHNSd0BPZ8LWxznjEFJ6h_cYAMxk_BN1Jl6imbuqLoNkyTettEJ",
  },
];

export default function HistoryTimelineSection() {
  const t = useTranslations("about.history");
  const tOperations = useTranslations("about.operations");
  const tTeam = useTranslations("about.team");
  const highlights = tOperations.raw("highlights") as string[];
  const items = t.raw("items") as Array<{ title: string; description: string }>;

  return (
    <section className="mx-auto max-w-[1440px] px-6 py-24">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-12">
          <div className="border border-outline-variant/40 bg-surface-container-low p-10 md:p-12">
            <h2 className="font-headline text-4xl font-black uppercase leading-none tracking-tight text-primary">
              {tOperations("title")}
            </h2>
            <p className="mt-6 font-body text-base leading-relaxed text-on-surface-variant">
              {tOperations("description")}
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {highlights.map((highlight, index) => (
                <div
                  key={highlight}
                  className="border border-outline-variant/30 bg-white px-5 py-5"
                >
                  <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-3 font-body text-sm leading-7 text-on-surface-variant">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-outline-variant/40 bg-primary p-10 md:p-12">
            <h2 className="font-headline text-4xl font-black uppercase leading-none tracking-tight text-white">
              {tTeam("title")}
            </h2>
            <p className="mt-6  font-body text-base leading-8 text-white/78">
              {tTeam("description")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {galleryImages.map((item, index) => (
            <article
              key={item.key}
              className="group overflow-hidden border border-outline-variant/30 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(18,55,31,0.1)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={items[index]?.title ?? "Woodland"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/18 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="p-6">
                <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-headline text-xl font-bold uppercase tracking-tight text-primary">
                  {items[index]?.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-on-surface-variant">
                  {items[index]?.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
