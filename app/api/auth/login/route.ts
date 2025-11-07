import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 필수 필드 검증
    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 입력해주세요" },
        { status: 400 }
      );
    }

    // 사용자 조회
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError || !user) {
      return NextResponse.json(
        { error: "등록되지 않은 이메일입니다" },
        { status: 401 }
      );
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.hashed_password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "비밀번호가 일치하지 않습니다" },
        { status: 401 }
      );
    }

    // 비밀번호 제외하고 반환
    const { hashed_password, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: "로그인 성공",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "로그인 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
