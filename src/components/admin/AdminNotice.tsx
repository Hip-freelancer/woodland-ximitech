interface AdminNoticeProps {
  message: string;
  tone?: "error" | "success" | "warning";
}

const toneClasses: Record<NonNullable<AdminNoticeProps["tone"]>, string> = {
  error: "border-error/20 bg-error-container text-on-error-container",
  success: "border-secondary/20 bg-secondary-fixed text-on-secondary-fixed",
  warning: "border-primary/20 bg-primary-fixed text-on-primary-fixed",
};

export default function AdminNotice({
  message,
  tone = "success",
}: AdminNoticeProps) {
  return (
    <div className={`border px-4 py-3 font-body text-sm ${toneClasses[tone]}`}>
      {message}
    </div>
  );
}
