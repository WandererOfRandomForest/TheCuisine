import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import SplashScreen from "./components/SplashScreen";
import Navbar from "./components/Navbar";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
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
      className={`${sans.variable} ${playfair.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans tracking-wide">
        <SplashScreen />
        <Navbar />
        <main className="flex-1 bg-[#FAF3E7]">
          {children}
        </main>
        <footer className="py-8 text-center text-sm shrink-0 bg-[#240502] text-[#FAF3E7]/70">
          <p className="font-medium">© {new Date().getFullYear()} TheCuisine. Dedicated to authentic flavors.</p>
        </footer>
      </body>
    </html>
  );
}
