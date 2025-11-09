"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Flower, Menu, X, AlertCircle, Home, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AdminOrderProvider } from "@/contexts/AdminOrderContext";

const navItems = [
  {
    title: "주문 관리",
    href: "/admin",
  },
  {
    title: "회원 관리",
    href: "/admin/users",
  },
  {
    title: "상품 관리",
    href: "/admin/products",
    subItems: [
      {
        title: "상품 현황",
        href: "/admin/products/status",
      },
      {
        title: "상품 등록",
        href: "/admin/products/register",
      },
    ],
  },
  {
    title: "매출 현황",
    href: "/admin/sales",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

  // 상품 관리 페이지에 있으면 자동으로 드롭다운 열기
  useEffect(() => {
    if (pathname.startsWith('/admin/products')) {
      setOpenDropdowns(prev => ({ ...prev, '/admin/products': true }));
    }
  }, [pathname]);

  useEffect(() => {
    if (!loading) {
      if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        // 관리자가 아니면 홈으로 리다이렉트
        router.push('/');
      } else {
        setIsChecking(false);
      }
    }
  }, [user, loading, router]);

  // 로딩 중이거나 권한 확인 중일 때
  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 권한이 없을 때 (리다이렉트 전 보여줄 메시지)
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">접근 권한 없음</h1>
          <p className="text-gray-600 mb-4">
            관리자 페이지에 접근할 수 있는 권한이 없습니다.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-2 left-2 z-50 p-2 bg-white rounded-lg shadow-lg touch-manipulation"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? (
          <X className="w-5 h-5 text-gray-900" />
        ) : (
          <Menu className="w-5 h-5 text-gray-900" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-[200px] sm:w-[220px] lg:w-[180px] bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="px-4 py-4 lg:px-3 lg:py-3 border-b border-gray-200">
            <Link href="/admin" className="flex items-center gap-2" onClick={() => setIsSidebarOpen(false)}>
              <Flower className="w-7 h-7 lg:w-6 lg:h-6 text-primary-600 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-base lg:text-sm font-bold text-gray-900 truncate">꽃집처녀</h1>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 lg:p-2 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.subItems && item.subItems.some(sub => pathname === sub.href));
                const isParentActive = item.subItems && item.subItems.some(sub => pathname === sub.href);
                const isDropdownOpen = openDropdowns[item.href] ?? false;

                const toggleDropdown = () => {
                  setOpenDropdowns(prev => ({
                    ...prev,
                    [item.href]: !prev[item.href]
                  }));
                };

                return (
                  <li key={item.href}>
                    {item.subItems ? (
                      <div>
                        <button
                          onClick={toggleDropdown}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3 lg:px-3 lg:py-2 rounded-lg transition-colors text-sm lg:text-xs font-medium touch-manipulation",
                            isParentActive
                              ? "bg-primary-50 text-primary-600"
                              : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          <span>{item.title}</span>
                          {isDropdownOpen ? (
                            <ChevronDown className="w-5 h-5 lg:w-4 lg:h-4" />
                          ) : (
                            <ChevronRight className="w-5 h-5 lg:w-4 lg:h-4" />
                          )}
                        </button>
                        {isDropdownOpen && (
                          <ul className="ml-2 mt-1 space-y-0.5">
                            {item.subItems.map((subItem) => {
                              const isSubActive = pathname === subItem.href;
                              return (
                                <li key={subItem.href}>
                                  <Link
                                    href={subItem.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={cn(
                                      "block px-4 py-2.5 lg:px-3 lg:py-1.5 rounded-lg transition-colors text-sm lg:text-xs touch-manipulation",
                                      isSubActive
                                        ? "bg-primary-100 text-primary-700 font-medium"
                                        : "text-gray-600 hover:bg-gray-50"
                                    )}
                                  >
                                    {subItem.title}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "block px-4 py-3 lg:px-3 lg:py-2 rounded-lg transition-colors text-sm lg:text-xs font-medium touch-manipulation",
                          isActive
                            ? "bg-primary-50 text-primary-600"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        {item.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0 ml-0">
        {/* Admin Header */}
        <header className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 pl-12 lg:pl-0">
            <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate">관리자 대시보드</h2>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium text-xs sm:text-sm touch-manipulation"
          >
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">쇼핑몰 홈</span>
            <span className="sm:hidden">홈</span>
          </Link>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-2 sm:p-3 overflow-auto">
          <AdminOrderProvider>{children}</AdminOrderProvider>
        </main>
      </div>
    </div>
  );
}