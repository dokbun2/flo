"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserCog, Shield } from "lucide-react";
import { supabase, User } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

export default function UsersManagementPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    // 수퍼관리자만 권한 변경 가능
    if (currentUser?.role !== "super_admin") {
      alert("수퍼관리자만 권한을 변경할 수 있습니다.");
      return;
    }

    try {
      const { error } = await supabase
        .from("users")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      // 로컬 상태 업데이트
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: newRole as User["role"] } : user
      ));

      const roleLabel = newRole === "admin" ? "관리자" : newRole === "super_admin" ? "수퍼관리자" : "일반";
      alert(`사용자 권한이 ${roleLabel}로 변경되었습니다.`);
    } catch (error) {
      console.error("Error updating role:", error);
      alert("권한 변경에 실패했습니다.");
    }
  };

  // 역할 기반 필터링
  const getFilteredUsersByRole = () => {
    if (!currentUser) return [];

    // 수퍼관리자는 모든 사용자 볼 수 있음
    if (currentUser.role === "super_admin") {
      return users;
    }

    // 일반 관리자는 일반 회원과 본인만 볼 수 있음
    if (currentUser.role === "admin") {
      return users.filter(user =>
        user.id === currentUser.id || // 본인
        user.role === "user" || // 일반 회원
        (!user.role) // role이 없는 경우 (일반 회원으로 간주)
      );
    }

    return [];
  };

  const filteredUsers = getFilteredUsersByRole().filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.phone && user.phone.includes(searchTerm))
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="px-1">
        <h1 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">회원 관리</h1>
      </div>

      {/* 검색 섹션 */}
      <div className="bg-white rounded-lg shadow p-2 sm:p-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <Label htmlFor="search" className="text-xs font-semibold whitespace-nowrap">
            회원 검색
          </Label>
          <div className="relative w-full sm:flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="search"
              type="text"
              placeholder="이름, 이메일, 전화번호"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 sm:h-8 text-xs w-full"
            />
          </div>
          <span className="text-xs text-gray-600 whitespace-nowrap sm:ml-auto">
            전체 회원: <span className="font-semibold text-primary-600">{filteredUsers.length}</span>명
          </span>
        </div>
      </div>

      {/* 회원 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto scrollbar-visible -mx-2 sm:mx-0">
          <Table className="text-xs w-full min-w-[700px]">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="px-2 sm:px-3 py-2 sm:py-3 text-left w-[80px] sm:w-[100px] font-semibold">가입일</TableHead>
                <TableHead className="px-2 sm:px-3 py-2 sm:py-3 text-left w-[70px] sm:w-[100px] font-semibold">이름</TableHead>
                <TableHead className="px-2 sm:px-3 py-2 sm:py-3 text-left font-semibold">이메일</TableHead>
                <TableHead className="px-2 sm:px-3 py-2 sm:py-3 text-left w-[100px] sm:w-[130px] font-semibold">전화번호</TableHead>
                <TableHead className="px-2 sm:px-3 py-2 sm:py-3 text-center w-[100px] sm:w-[120px] font-semibold">현재 역할</TableHead>
                <TableHead className="px-2 sm:px-3 py-2 sm:py-3 text-center w-[90px] sm:w-[120px] font-semibold">역할 변경</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-3 text-gray-500 text-xs">
                    회원이 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-t hover:bg-gray-50 transition-colors">
                    <TableCell className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap text-gray-600 text-[11px] sm:text-xs">
                      {user.created_at ? format(new Date(user.created_at), "yy-MM-dd") : "-"}
                    </TableCell>
                    <TableCell className="px-2 sm:px-3 py-2 sm:py-3 font-medium text-gray-900 text-[11px] sm:text-xs">
                      {user.name}
                    </TableCell>
                    <TableCell className="px-2 sm:px-3 py-2 sm:py-3 text-gray-600 text-[11px] sm:text-xs truncate max-w-[150px]">
                      {user.email}
                    </TableCell>
                    <TableCell className="px-2 sm:px-3 py-2 sm:py-3 text-gray-600 text-[11px] sm:text-xs">
                      {user.phone || "-"}
                    </TableCell>
                    <TableCell className="px-2 sm:px-3 py-2 sm:py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                          user.role === "super_admin"
                            ? "bg-red-100 text-red-700"
                            : user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role === "super_admin" ? (
                          <>
                            <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            <span className="hidden sm:inline">수퍼관리자</span>
                            <span className="sm:hidden">수퍼</span>
                          </>
                        ) : user.role === "admin" ? (
                          "관리자"
                        ) : (
                          "일반"
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="px-2 sm:px-3 py-2 sm:py-3">
                      <div className="flex justify-center">
                        {/* 수퍼관리자만 권한 변경 가능, 수퍼관리자 본인은 변경 불가 */}
                        {currentUser?.role === "super_admin" && user.role !== "super_admin" ? (
                          <Select
                            value={user.role || "user"}
                            onValueChange={(value) => updateUserRole(user.id, value)}
                          >
                            <SelectTrigger className="h-7 sm:h-7 w-20 sm:w-28 text-[11px] sm:text-xs touch-manipulation">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user" className="text-xs">
                                일반
                              </SelectItem>
                              <SelectItem value="admin" className="text-xs">
                                관리자
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 통계 섹션 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        <div className="bg-white rounded-lg shadow p-2.5 sm:p-3">
          <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1">전체 회원</p>
          <p className="text-base sm:text-lg font-bold text-gray-900">{getFilteredUsersByRole().length}명</p>
        </div>
        <div className="bg-white rounded-lg shadow p-2.5 sm:p-3">
          <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1">일반 회원</p>
          <p className="text-base sm:text-lg font-bold text-blue-600">
            {getFilteredUsersByRole().filter(u => !u.role || u.role === "user").length}명
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-2.5 sm:p-3">
          <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1">관리자</p>
          <p className="text-base sm:text-lg font-bold text-purple-600">
            {getFilteredUsersByRole().filter(u => u.role === "admin").length}명
          </p>
        </div>
        {currentUser?.role === "super_admin" && (
          <div className="bg-white rounded-lg shadow p-2.5 sm:p-3">
            <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1">수퍼관리자</p>
            <p className="text-base sm:text-lg font-bold text-red-600">
              {users.filter(u => u.role === "super_admin").length}명
            </p>
          </div>
        )}
        <div className="bg-white rounded-lg shadow p-2.5 sm:p-3">
          <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1">오늘 가입</p>
          <p className="text-base sm:text-lg font-bold text-green-600">
            {getFilteredUsersByRole().filter(u => {
              if (!u.created_at) return false;
              const today = new Date().toDateString();
              return new Date(u.created_at).toDateString() === today;
            }).length}명
          </p>
        </div>
      </div>
    </div>
  );
}
