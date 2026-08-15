import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import CommandPalette from "@/components/CommandPalette";
import ErrorBoundary from "@/components/ErrorBoundary";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CreativeTreasury - Creator Analytics",
    template: "%s | CreativeTreasury",
  },
  description: "Premium financial dashboard for creators",
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true} storageKey="theme">
          <Providers>
            <h1 className="sr-only">CreativeTreasury - Creator Analytics Dashboard</h1>
            <Sidebar />
            <div className="md:ml-64">
              <TopBar />
              <main className="min-h-screen animate-fadeIn p-8">
                <ErrorBoundary>{children}</ErrorBoundary>
              </main>
            </div>
          </Providers>
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}
