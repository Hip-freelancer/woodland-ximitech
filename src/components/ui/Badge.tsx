interface BadgeProps {
  label: string;
  variant?: "default" | "green" | "dark";
}

const variants = {
  default: "bg-[#e7e2d8] text-[#331917]",
  green: "bg-[#b3d9ce] text-[#396759]",
  dark: "bg-[#331917] text-white",
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
