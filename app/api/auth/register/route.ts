import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, phone } = body;

    // 필수 필드 검증
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "이메일, 비밀번호, 이름은 필수 항목입니다" },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "올바른 이메일 형식이 아닙니다" },
        { status: 400 }
      );
    }

    // 비밀번호 강도 검증
    if (password.length < 8) {
      return NextResponse.json(
        { error: "비밀번호는 최소 8자 이상이어야 합니다" },
        { status: 400 }
      );
    }

    // 중복 이메일 체크
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "이미 사용 중인 이메일입니다" },
        { status: 400 }
      );
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          email,
          name,
          phone,
          hashed_password: hashedPassword,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: "회원가입 중 오류가 발생했습니다" },
        { status: 500 }
      );
    }

    // 비밀번호 제외하고 반환
    const { hashed_password, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: "회원가입이 완료되었습니다",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
