"use client";

import Link from "next/link";
import { Search, User, ShoppingCart, Flower, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "@/components/auth/LoginModal";
import { RegisterModal } from "@/components/auth/RegisterModal";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const cartItemCount = 0; // TODO: Connect to cart state

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Flower className="w-7 h-7 text-white" />
            <h1 className="text-2xl font-bold text-white whitespace-nowrap hidden sm:block">
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
                  <button className="flex items-center gap-2 p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                    <User className="w-5 h-5 text-neutral-700" />
                    <span className="text-sm font-medium text-neutral-700">{user.name}</span>
                  </button>

                  {/* 드롭다운 메뉴 */}
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-gray-200">
                    <Link
                      href="/account"
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
                className="hidden sm:flex items-center gap-2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Login"
              >
                <User className="w-5 h-5 text-neutral-700" />
                <span className="text-sm font-medium text-neutral-700">로그인</span>
              </button>
            )}

            <Link
              href="/cart"
              className="hidden sm:flex relative p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5 text-neutral-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20">
            <div className="space-y-2">
              {user ? (
                <>
                  <div className="px-4 py-2 text-white font-semibold">
                    {user.name}님
                  </div>
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    마이페이지
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  로그인
                </button>
              )}
              <Link
                href="/cart"
                className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                장바구니
              </Link>
              <div className="px-4 py-2 border-t border-white/20 mt-2 pt-2">
                <input
                  type="text"
                  placeholder="검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 rounded-full bg-white/20 text-white placeholder-white/60 border-none focus:outline-none focus:ring-2 focus:ring-white text-sm"
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
