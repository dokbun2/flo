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
      <DialogContent className="max-w-[350px] sm:max-w-[380px] bg-white border-0 rounded-3xl shadow-2xl p-6">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-2xl font-bold text-center text-neutral-900">
            로그인
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* 에러 메시지 */}
          {(localError || error) && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded-lg text-xs font-medium">
              {localError || error}
            </div>
          )}

          {/* 이메일 */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-neutral-800 uppercase tracking-wide">이메일</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11 bg-neutral-50 border border-neutral-300 rounded-lg focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm text-neutral-900 placeholder-neutral-400 transition-all h-9"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold text-neutral-800 uppercase tracking-wide">비밀번호</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                id="password"
                type="password"
                placeholder="8자 이상"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11 bg-neutral-50 border border-neutral-300 rounded-lg focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm text-neutral-900 placeholder-neutral-400 transition-all h-9"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 로그인 버튼 */}
          <Button
            type="submit"
            className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-2 rounded-lg transition-all mt-1 h-9 text-sm"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>

          {/* 회원가입 링크 */}
          <div className="text-center text-xs mt-3 pt-3 border-t border-neutral-200">
            <span className="text-neutral-600">계정이 없으신가요? </span>
            {onSwitchToRegister ? (
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-neutral-900 hover:text-neutral-700 font-bold transition-colors"
              >
                회원가입
              </button>
            ) : (
              <Link
                href="/register"
                onClick={onClose}
                className="text-neutral-900 hover:text-neutral-700 font-bold transition-colors"
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
