import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import { ProductProvider } from "@/contexts/ProductContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  variable: "--font-serif-kr",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "꽃집 쇼핑몰",
  description: "신선한 꽃과 식물을 만나보세요",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning className={notoSerifKR.variable}>
      <body suppressHydrationWarning className="font-serif">
        <AuthProvider>
          <CartProvider>
            <ProductProvider>
              <OrderProvider>{children}</OrderProvider>
            </ProductProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
