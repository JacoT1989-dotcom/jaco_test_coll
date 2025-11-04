// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import { ApolloWrapper } from "@/lib/apollo-client";

export const metadata: Metadata = {
  title: "Frontend Engineering Interview - Jaco Thiart",
  description:
    "Transaction Management System built with Next.js, TypeScript, and TailwindCSS",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ApolloWrapper>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              {/* Fixed Header with theme toggle */}
              <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                  <h1 className="text-xl font-semibold">Travel Assistant</h1>
                  <ThemeToggle />
                </div>
              </header>

              {/* Main content with top padding to account for fixed header */}
              <main className="pt-[57px]">{children}</main>
            </div>
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
