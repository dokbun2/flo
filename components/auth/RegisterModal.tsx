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
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">회원가입</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* 에러 메시지 */}
          {(localError || error) && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {localError || error}
            </div>
          )}

          {/* 이름 */}
          <div className="space-y-2">
            <Label htmlFor="name">이름 *</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="홍길동"
                value={formData.name}
                onChange={handleChange}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 이메일 */}
          <div className="space-y-2">
            <Label htmlFor="email">이메일 *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 전화번호 */}
          <div className="space-y-2">
            <Label htmlFor="phone">전화번호 (선택)</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="010-1234-5678"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호 *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="8자 이상 입력"
                value={formData.password}
                onChange={handleChange}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">비밀번호 확인 *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="비밀번호 재입력"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 회원가입 버튼 */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "가입 중..." : "회원가입"}
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

          {/* 소셜 회원가입 (추후 구현) */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignup}
              disabled
            >
              <Chrome className="w-5 h-5 mr-2" />
              Google 회원가입 (준비 중)
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-yellow-300 hover:bg-yellow-400 border-yellow-400"
              onClick={handleKakaoSignup}
              disabled
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.765 1.828 5.192 4.574 6.597-.188.696-.614 2.434-.701 2.819-.103.453.166.447.35.325.135-.09 2.181-1.476 3.042-2.062C10.089 18.815 11.036 19 12 19c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
              </svg>
              카카오 회원가입 (준비 중)
            </Button>
          </div>

          {/* 로그인 링크 */}
          <div className="text-center text-sm">
            <span className="text-gray-600">이미 계정이 있으신가요? </span>
            {onSwitchToLogin ? (
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                로그인
              </button>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="text-primary-600 hover:text-primary-700 font-semibold"
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
