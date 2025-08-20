import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: 'pluto',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru" suppressHydrationWarning>
            <head>
                <meta name="robots" content="noindex, nofollow" />
            </head>
            <body className={cn("bg-background text-foreground", GeistSans.className)}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <main className="p-4 container max-w-xl min-w-max mx-auto h-screen bg-background antialiased">
                        {children}
                        <Toaster />
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
