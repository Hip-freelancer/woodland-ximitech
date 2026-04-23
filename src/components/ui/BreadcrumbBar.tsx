import { Link } from "@/i18n/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbBarProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbBar({ items }: BreadcrumbBarProps) {
  return (
    <section className="border-b border-outline-variant/20 bg-surface-container-lowest">
      <div className="mx-auto max-w-[1440px] px-6 py-5">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-3">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <div key={`${item.label}-${index}`} className="flex items-center gap-3">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="font-body text-[1.05rem] text-on-surface-variant transition-colors duration-200 hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-headline text-[1.05rem] font-black uppercase tracking-tight text-primary">
                    {item.label}
                  </span>
                )}
                {!isLast ? (
                  <span className="font-body text-xl text-outline">/</span>
                ) : null}
              </div>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
