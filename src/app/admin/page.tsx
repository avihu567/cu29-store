import type { Metadata } from "next";
import AdminApp from "@/components/admin/AdminApp";

export const metadata: Metadata = {
  title: "ניהול",
  robots: { index: false, follow: false },
};

/** Private dashboard. All data comes from /api/admin/* (cookie-protected). */
export default function AdminPage() {
  return <AdminApp />;
}
