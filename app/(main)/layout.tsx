import { Header } from '@/components/layout/Header';
import { CategoryBar } from '@/components/layout/CategoryBar';
import Footer from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Category Bar */}
      <CategoryBar />

      {/* Main Content */}
      <main className="flex-1 mb-16 md:mb-0">{children}</main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
