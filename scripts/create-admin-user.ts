import { config } from "dotenv";
import { resolve } from "path";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

// .env.local 파일 로드
config({ path: resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase 환경 변수가 설정되지 않았습니다.");
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl);
  console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "설정됨" : "없음");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminUser() {
  const superAdminEmail = "dokbun2@gmail.com";
  const adminPassword = "admin123"; // 원하는 비밀번호로 변경하세요
  const adminName = "수퍼관리자";

  try {
    console.log("수퍼관리자 계정 생성 중...");

    // 기존 계정 확인
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", superAdminEmail)
      .single();

    if (existingUser) {
      console.log("이미 존재하는 계정입니다. role을 super_admin으로 업데이트합니다...");

      const { error: updateError } = await supabase
        .from("users")
        .update({ role: "super_admin" })
        .eq("email", superAdminEmail);

      if (updateError) {
        console.error("업데이트 실패:", updateError);
        return;
      }

      console.log("✅ 계정 권한이 super_admin으로 업데이트되었습니다!");
      console.log(`이메일: ${superAdminEmail}`);
      return;
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // 수퍼관리자 계정 생성
    const { data, error } = await supabase.from("users").insert([
      {
        email: superAdminEmail,
        name: adminName,
        hashed_password: hashedPassword,
        role: "super_admin",
      },
    ]).select();

    if (error) {
      console.error("수퍼관리자 계정 생성 실패:", error);
      return;
    }

    console.log("✅ 수퍼관리자 계정이 성공적으로 생성되었습니다!");
    console.log(`이메일: ${superAdminEmail}`);
    console.log(`비밀번호: ${adminPassword}`);
    console.log(`권한: super_admin`);
  } catch (error) {
    console.error("오류 발생:", error);
  }
}

createAdminUser();
