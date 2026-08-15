import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Review notifications across orders, products, finance, marketing and team.",
};

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}