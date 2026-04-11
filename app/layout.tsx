import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Cuisine | Premium Indian Dishes",
  description: "Explore the authentic tastes of India state by state.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex justify-between items-center shadow-sm">
          <div className="text-2xl font-bold tracking-tight text-gray-900" style={{ fontFamily: 'var(--font-outfit)' }}>
            The<span className="text-amber-600">Cuisine.</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <a href="/" className="hover:text-amber-600 transition-colors">Home</a>
            <a href="#map" className="hover:text-amber-600 transition-colors">Explore States</a>
          </nav>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="py-8 text-center text-sm text-gray-500 border-t border-gray-100 shrink-0">
          © {new Date().getFullYear()} TheCuisine. Dedicated to authentic flavors.
        </footer>
      </body>
    </html>
  );
}
