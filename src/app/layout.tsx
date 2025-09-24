import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Nexpass - Personal Finance Dashboard",
  description: "Modern personal finance dashboard with glassmorphism design",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black" suppressHydrationWarning>
        <QueryProvider>
          <div className="min-h-screen">
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}