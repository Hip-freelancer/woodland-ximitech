interface BadgeProps {
  label: string;
  variant?: "default" | "green" | "dark";
}

const variants = {
  default: "bg-tertiary-fixed text-on-tertiary-fixed",
  green: "bg-secondary-fixed text-secondary",
  dark: "bg-primary text-on-primary",
};

export default function Badge({ label, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`font-label text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 ${variants[variant]}`}
    >
      {label}
    </span>
  );
}
