"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Mail, Lock, Chrome } from "lucide-react";
import Link from "next/link";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email || !password) {
      setLocalError("이메일과 비밀번호를 입력해주세요");
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      onClose();
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setLocalError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert("Google 로그인은 추후 구현 예정입니다");
  };

  const handleKakaoLogin = () => {
    alert("카카오 로그인은 추후 구현 예정입니다");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">로그인</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* 에러 메시지 */}
          {(localError || error) && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {localError || error}
            </div>
          )}

          {/* 이메일 */}
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="8자 이상 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 로그인 버튼 */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>

          {/* 구분선 */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">또는</span>
            </div>
          </div>

          {/* 소셜 로그인 (추후 구현) */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled
            >
              <Chrome className="w-5 h-5 mr-2" />
              Google 로그인 (준비 중)
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-yellow-300 hover:bg-yellow-400 border-yellow-400"
              onClick={handleKakaoLogin}
              disabled
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.765 1.828 5.192 4.574 6.597-.188.696-.614 2.434-.701 2.819-.103.453.166.447.35.325.135-.09 2.181-1.476 3.042-2.062C10.089 18.815 11.036 19 12 19c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
              </svg>
              카카오 로그인 (준비 중)
            </Button>
          </div>

          {/* 회원가입 링크 */}
          <div className="text-center text-sm">
            <span className="text-gray-600">계정이 없으신가요? </span>
            {onSwitchToRegister ? (
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                회원가입
              </button>
            ) : (
              <Link
                href="/register"
                onClick={onClose}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                회원가입
              </Link>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
