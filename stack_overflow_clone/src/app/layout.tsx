import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stack Overflow Clone | Community Q&A",
  description: "A high-performance Q&A platform built with Next.js and Appwrite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased selection:bg-blue-100 selection:text-blue-700",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        figtree.variable
      )}
    >
      <body className="min-h-full bg-slate-50/50 flex flex-col">
        {/* Background Grid Pattern */}
        <div className="fixed inset-0 z-[-1] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        <Navbar />
        
        <div className="flex-1 flex max-w-7xl mx-auto w-full">
          <Sidebar />
          <main className="flex-1 p-6 lg:p-10">
            {children}
          </main>
        </div>
        
        <footer className="border-t bg-white py-10 mt-20">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p>&copy; 2026 Stack Overflow Clone. Built with passion and Next.js.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}