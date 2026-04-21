import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata = {
  robots: "noindex, nofollow",
  title: "Admin Login | Woodland",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const query = await searchParams;
  const nextPath = Array.isArray(query.next) ? query.next[0] : query.next;

  return <AdminLoginForm nextPath={nextPath ?? "/admin"} />;
}
