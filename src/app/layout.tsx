import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RoPhim - Phim hay cả rổ | Xem Phim Mới HD Online Vietsub",
  description: "RoPhim - Xem phim miễn phí chất lượng HD, 4K với thuyết minh, lồng tiếng. Kho phim mới khổng lồ, phim chiếu rạp, phim bộ, phim lẻ từ Việt Nam, Hàn Quốc, Trung Quốc, Thái Lan, Nhật Bản, Âu Mỹ.",
  keywords: "xem phim online, phim HD, phim miễn phí, phim Việt Nam, phim Hàn Quốc, phim Trung Quốc, phim chiếu rạp",
  authors: [{ name: "RoPhim Team" }],
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} font-sans antialiased bg-black min-h-screen`}>
        <Header />
        <main className="relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
