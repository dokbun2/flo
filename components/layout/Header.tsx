"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, Flower, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "@/components/auth/LoginModal";
import { RegisterModal } from "@/components/auth/RegisterModal";

const categories = [
  "축하화환",
  "근조화환",
  "쌀화환",
  "1단·2단화환",
  "동양란",
  "서양란",
  "관엽공부",
  "공기정화식물",
  "금전수·스투키",
  "꽃다발·꽃상자",
  "꽃바구니",
];

export function Header() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { user, logout } = useAuth();

  // 흰색 배경 페이지 체크 (마이페이지, 카테고리 등)
  const isLightPage = pathname?.startsWith('/mypage') || pathname?.startsWith('/category') || pathname?.startsWith('/cart');
  const shouldShowDarkHeader = isMenuOpen || isLightPage;

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-200 ${shouldShowDarkHeader ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Flower className={`w-7 h-7 transition-colors ${shouldShowDarkHeader ? 'text-neutral-900' : 'text-white'}`} />
            <h1 className={`text-2xl font-bold whitespace-nowrap transition-colors ${shouldShowDarkHeader ? 'text-neutral-900' : 'text-white'}`}>
              꽃집처녀
            </h1>
          </Link>

          {/* Center: Search (Desktop Only) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="원하는 꽃을 검색해보세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-4 pr-10 rounded-full bg-neutral-100 border-none focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-primary-600 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right: User + Cart + Menu */}
          <div className="flex items-center gap-2">
            {/* Desktop Icons */}
            {user ? (
              // 로그인 상태
              <div className="hidden sm:flex items-center gap-2">
                <div className="relative group">
                  <button className={`p-2 rounded-lg transition-colors ${shouldShowDarkHeader ? 'hover:bg-neutral-100' : 'hover:bg-white/20'}`}>
                    <User className={`w-5 h-5 transition-colors ${shouldShowDarkHeader ? 'text-neutral-900' : 'text-white'}`} />
                  </button>

                  {/* 드롭다운 메뉴 */}
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-gray-200">
                    <Link
                      href="/mypage"
                      className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      마이페이지
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      로그아웃
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // 로그아웃 상태
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className={`hidden sm:flex p-2 rounded-lg transition-colors ${shouldShowDarkHeader ? 'hover:bg-neutral-100' : 'hover:bg-white/20'}`}
                aria-label="Login"
              >
                <User className={`w-5 h-5 transition-colors ${shouldShowDarkHeader ? 'text-neutral-900' : 'text-white'}`} />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${shouldShowDarkHeader ? 'hover:bg-neutral-100' : 'hover:bg-white/20'}`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className={`w-6 h-6 transition-colors ${shouldShowDarkHeader ? 'text-neutral-900' : 'text-white'}`} />
              ) : (
                <Menu className={`w-6 h-6 transition-colors ${shouldShowDarkHeader ? 'text-neutral-900' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 bg-white rounded-b-2xl overflow-hidden shadow-lg">
            <div className="px-4 py-4 space-y-3">
              {/* User Section */}
              {user ? (
                <div className="space-y-2 pb-3 border-b border-neutral-200">
                  <div className="text-sm font-semibold text-neutral-900">
                    {user.name}님
                  </div>
                  <Link
                    href="/mypage"
                    className="block px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    마이페이지
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className="pb-3">
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-xs text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-all font-semibold h-9 flex items-center justify-center"
                  >
                    로그인
                  </button>
                </div>
              )}

              {/* Category Section */}
              <div className="space-y-2 pb-3">
                <div className="text-xs font-bold text-neutral-600 uppercase tracking-wider px-1">카테고리</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/category/${encodeURIComponent(category)}`}
                      className="block px-2.5 py-2 text-xs text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-all text-center font-medium border border-neutral-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Search Section */}
              <div className="pt-1">
                <input
                  type="text"
                  placeholder="상품 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 text-neutral-900 placeholder-neutral-500 border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 text-xs h-9"
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 로그인/회원가입 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </header>
  );
}
