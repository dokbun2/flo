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
import { Search, UserCog } from "lucide-react";
import { supabase, User } from "@/lib/supabase";
import { format } from "date-fns";

export default function UsersManagementPage() {
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

  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    try {
      const { error } = await supabase
        .from("users")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      // 로컬 상태 업데이트
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));

      alert(`사용자 권한이 ${newRole}로 변경되었습니다.`);
    } catch (error) {
      console.error("Error updating role:", error);
      alert("권한 변경에 실패했습니다.");
    }
  };

  const filteredUsers = users.filter((user) => {
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
    <div className="space-y-2">
      <div className="px-1">
        <h1 className="text-base md:text-lg font-bold text-gray-900">회원 관리</h1>
      </div>

      {/* 검색 섹션 */}
      <div className="bg-white rounded-lg shadow p-2">
        <div className="flex items-center gap-3">
          <Label htmlFor="search" className="text-xs font-semibold whitespace-nowrap">
            회원 검색
          </Label>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="search"
              type="text"
              placeholder="이름, 이메일, 전화번호"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-8 text-xs"
            />
          </div>
          <span className="text-xs text-gray-600 whitespace-nowrap">
            전체 회원: <span className="font-semibold text-primary-600">{filteredUsers.length}</span>명
          </span>
        </div>
      </div>

      {/* 회원 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto scrollbar-visible">
          <Table className="text-xs w-full">
            <TableHeader>
              <TableRow className="h-7">
                <TableHead className="px-1.5 py-1 text-left">가입일</TableHead>
                <TableHead className="px-1.5 py-1 text-left">이름</TableHead>
                <TableHead className="px-1.5 py-1 text-left">이메일</TableHead>
                <TableHead className="px-1.5 py-1 text-left">전화번호</TableHead>
                <TableHead className="px-1.5 py-1 text-center">역할</TableHead>
                <TableHead className="px-1.5 py-1 text-center">관리</TableHead>
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
                  <TableRow key={user.id} className="h-7 border-t">
                    <TableCell className="px-1.5 py-0.5 whitespace-nowrap">
                      {user.created_at ? format(new Date(user.created_at), "yy-MM-dd") : "-"}
                    </TableCell>
                    <TableCell className="px-1.5 py-0.5 font-medium">
                      {user.name}
                    </TableCell>
                    <TableCell className="px-1.5 py-0.5 text-gray-600">
                      {user.email}
                    </TableCell>
                    <TableCell className="px-1.5 py-0.5">
                      {user.phone || "-"}
                    </TableCell>
                    <TableCell className="px-1.5 py-0.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role === "admin" ? "관리자" : "일반"}
                      </span>
                    </TableCell>
                    <TableCell className="px-1.5 py-0.5 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserRole(user.id, user.role || "user")}
                        className="h-6 px-2 text-xs"
                      >
                        <UserCog className="w-3 h-3 mr-1" />
                        권한변경
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 통계 섹션 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="bg-white rounded-lg shadow p-3">
          <p className="text-xs text-gray-600 mb-1">전체 회원</p>
          <p className="text-lg font-bold text-gray-900">{users.length}명</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3">
          <p className="text-xs text-gray-600 mb-1">일반 회원</p>
          <p className="text-lg font-bold text-blue-600">
            {users.filter(u => u.role !== "admin").length}명
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-3">
          <p className="text-xs text-gray-600 mb-1">관리자</p>
          <p className="text-lg font-bold text-purple-600">
            {users.filter(u => u.role === "admin").length}명
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-3">
          <p className="text-xs text-gray-600 mb-1">오늘 가입</p>
          <p className="text-lg font-bold text-green-600">
            {users.filter(u => {
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
