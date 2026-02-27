import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/app-navbar";
import { NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/mode-toggle";
import UserHeader from "@/components/user-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roadessy Dashboard",
  description: "A dashboard for managing and visualizing Roadessy road data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased font-mono `}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider
              style={
                {
                  "--sidebar-width": "14rem",
                  "--sidebar-width-mobile": "14rem",
                } as React.CSSProperties
              }
            >
              <AppSidebar />
              <main className="w-full tracking-tight">
                <div className="sticky top-0 overflow-hidden w-full flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-background z-10000">
                  <SidebarTrigger className="cursor-pointer" />
                  <Navigation />
                </div>
                {children}
              </main>
            </SidebarProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
