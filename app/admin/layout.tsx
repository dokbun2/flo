"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flower, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  {
    title: "주문 관리",
    href: "/admin",
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6 text-gray-900" />
        ) : (
          <Menu className="w-6 h-6 text-gray-900" />
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
        "fixed lg:static inset-y-0 left-0 z-40 w-[180px] bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="px-3 py-3 border-b border-gray-200">
            <Link href="/admin" className="flex items-center gap-1">
              <Flower className="w-6 h-6 text-primary-600 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-gray-900 truncate">꽃집처녀</h1>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.subItems && item.subItems.some(sub => pathname === sub.href));
                const isParentActive = item.subItems && item.subItems.some(sub => pathname === sub.href);

                return (
                  <li key={item.href}>
                    {item.subItems ? (
                      <div>
                        <div
                          className={cn(
                            "px-3 py-2 rounded-lg transition-colors cursor-default text-xs font-medium",
                            isParentActive
                              ? "bg-primary-50 text-primary-600"
                              : "text-gray-700"
                          )}
                        >
                          {item.title}
                        </div>
                        <ul className="ml-2 mt-0 space-y-0.5">
                          {item.subItems.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            return (
                              <li key={subItem.href}>
                                <Link
                                  href={subItem.href}
                                  onClick={() => setIsSidebarOpen(false)}
                                  className={cn(
                                    "block px-3 py-1.5 rounded-lg transition-colors text-xs",
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
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "block px-3 py-2 rounded-lg transition-colors text-xs font-medium",
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
      <main className="flex-1 p-4 md:p-6 overflow-auto lg:ml-0">
        <div className="max-w-7xl mx-auto pt-12 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}