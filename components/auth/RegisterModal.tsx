"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User as UserIcon, Phone, Chrome } from "lucide-react";
import Link from "next/link";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const { register, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    // 유효성 검사
    if (!formData.email || !formData.password || !formData.name) {
      setLocalError("이메일, 비밀번호, 이름은 필수 항목입니다");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("비밀번호가 일치하지 않습니다");
      return;
    }

    if (formData.password.length < 8) {
      setLocalError("비밀번호는 최소 8자 이상이어야 합니다");
      return;
    }

    try {
      setIsLoading(true);
      await register(formData.email, formData.password, formData.name, formData.phone);
      onClose();
      // 폼 초기화
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        phone: "",
      });
    } catch (err: any) {
      setLocalError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    alert("Google 회원가입은 추후 구현 예정입니다");
  };

  const handleKakaoSignup = () => {
    alert("카카오 회원가입은 추후 구현 예정입니다");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[350px] sm:max-w-[420px] max-h-[90vh] overflow-y-auto bg-white border-0 rounded-3xl shadow-2xl p-6">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-2xl font-bold text-center text-neutral-900">
            회원가입
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* 에러 메시지 */}
          {(localError || error) && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded-lg text-xs font-medium">
              {localError || error}
            </div>
          )}

          {/* 이름 */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold text-neutral-800 uppercase tracking-wide">이름 *</Label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="홍길동"
                value={formData.name}
                onChange={handleChange}
                className="pl-11 bg-neutral-50 border border-neutral-300 rounded-lg focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm text-neutral-900 placeholder-neutral-400 transition-all h-9"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 이메일 */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-neutral-800 uppercase tracking-wide">이메일 *</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                className="pl-11 bg-neutral-50 border border-neutral-300 rounded-lg focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm text-neutral-900 placeholder-neutral-400 transition-all h-9"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 전화번호 */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-semibold text-neutral-800 uppercase tracking-wide">전화번호</Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="010-1234-5678"
                value={formData.phone}
                onChange={handleChange}
                className="pl-11 bg-neutral-50 border border-neutral-300 rounded-lg focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm text-neutral-900 placeholder-neutral-400 transition-all h-9"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold text-neutral-800 uppercase tracking-wide">비밀번호 *</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="8자 이상"
                value={formData.password}
                onChange={handleChange}
                className="pl-11 bg-neutral-50 border border-neutral-300 rounded-lg focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm text-neutral-900 placeholder-neutral-400 transition-all h-9"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-semibold text-neutral-800 uppercase tracking-wide">비밀번호 확인 *</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="재입력"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-11 bg-neutral-50 border border-neutral-300 rounded-lg focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm text-neutral-900 placeholder-neutral-400 transition-all h-9"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 회원가입 버튼 */}
          <Button
            type="submit"
            className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-2 rounded-lg transition-all mt-1 h-9 text-sm"
            disabled={isLoading}
          >
            {isLoading ? "가입 중..." : "회원가입"}
          </Button>

          {/* 로그인 링크 */}
          <div className="text-center text-xs mt-3 pt-3 border-t border-neutral-200">
            <span className="text-neutral-600">이미 계정이 있으신가요? </span>
            {onSwitchToLogin ? (
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-neutral-900 hover:text-neutral-700 font-bold transition-colors"
              >
                로그인
              </button>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="text-neutral-900 hover:text-neutral-700 font-bold transition-colors"
              >
                로그인
              </Link>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
