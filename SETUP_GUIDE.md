# 로그인 기능 설정 가이드

## 📦 1. 패키지 설치 (완료됨)
```bash
npm install @supabase/supabase-js bcryptjs
npm install --save-dev @types/bcryptjs
```

---

## 🗄️ 2. Supabase 데이터베이스 설정

### 2.1 Supabase 프로젝트 생성
1. [Supabase](https://supabase.com) 접속 및 회원가입/로그인
2. **New Project** 클릭
3. 프로젝트 정보 입력:
   - Organization: 새로 만들거나 기존 선택
   - Project Name: `flo` (또는 원하는 이름)
   - Database Password: 안전한 비밀번호 설정 (저장 필수!)
   - Region: `Northeast Asia (Seoul)` 선택
4. **Create new project** 클릭 (1-2분 소요)

### 2.2 데이터베이스 테이블 생성
프로젝트가 생성되면 좌측 메뉴에서 **SQL Editor** 클릭 후 아래 SQL 실행:

```sql
-- users 테이블 생성
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  hashed_password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 이메일 인덱스 추가 (검색 속도 향상)
CREATE INDEX idx_users_email ON users(email);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

**RUN** 버튼 클릭하여 실행

### 2.3 RLS (Row Level Security) 설정
보안을 위해 RLS를 비활성화합니다 (API에서 처리):

좌측 메뉴 **Authentication** > **Policies** 이동:
- `users` 테이블에서 **Disable RLS** 클릭

---

## 🔑 3. 환경 변수 설정

### 3.1 Supabase 키 가져오기
1. Supabase 프로젝트 대시보드
2. 좌측 메뉴 **Settings** (톱니바퀴 아이콘) 클릭
3. **API** 선택
4. 아래 정보 복사:
   - **Project URL** (예: `https://xxxxx.supabase.co`)
   - **anon public** 키

### 3.2 .env.local 파일 생성
프로젝트 루트에 `.env.local` 파일 생성:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://여기에_복사한_PROJECT_URL_입력
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_복사한_ANON_KEY_입력

# 소셜 로그인 (추후 사용 - 현재는 비워둬도 됨)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
```

**⚠️ 중요:** `.env.local` 파일은 절대 Git에 커밋하지 마세요! (`.gitignore`에 이미 포함되어 있음)

---

## ✅ 4. 테스트

### 4.1 개발 서버 시작
```bash
npm run dev
```

### 4.2 회원가입 테스트
1. http://localhost:3000 접속
2. 우측 상단 **로그인** 버튼 클릭
3. 모달 하단 **회원가입** 링크 클릭
4. 정보 입력 후 **회원가입** 버튼 클릭
5. 자동으로 로그인됨

### 4.3 로그인/로그아웃 테스트
1. 우측 상단에 사용자 이름 표시 확인
2. 이름 클릭 시 드롭다운 메뉴 표시
3. **로그아웃** 클릭
4. 다시 **로그인** 버튼으로 변경되는지 확인

---

## 🐛 5. 문제 해결

### 문제: "Cannot read properties of undefined"
**원인:** 환경 변수가 설정되지 않음
**해결:**
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 환경 변수명 앞에 `NEXT_PUBLIC_`이 정확히 붙어있는지 확인
3. 개발 서버 재시작 (`Ctrl+C` 후 `npm run dev`)

### 문제: "이미 사용 중인 이메일입니다"
**원인:** 같은 이메일로 이미 가입됨
**해결:**
1. Supabase 대시보드 > **Table Editor** > `users` 테이블에서 해당 행 삭제
2. 또는 다른 이메일로 테스트

### 문제: "Insert error" 또는 500 에러
**원인:** 데이터베이스 테이블이 생성되지 않음
**해결:**
1. Supabase **SQL Editor**에서 테이블 생성 SQL 다시 실행
2. **Table Editor**에서 `users` 테이블이 있는지 확인

---

## 📱 6. 다음 단계 (선택사항)

### 6.1 Google 로그인 추가
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. OAuth 2.0 클라이언트 ID 생성
3. `.env.local`에 키 추가
4. `LoginModal.tsx`, `RegisterModal.tsx`에서 `disabled` 제거

### 6.2 카카오 로그인 추가
1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 애플리케이션 생성 및 REST API 키 발급
3. `.env.local`에 키 추가
4. 카카오 OAuth 구현 코드 추가

### 6.3 이메일 인증 추가
1. Supabase에서 이메일 인증 활성화
2. 회원가입 시 인증 이메일 발송
3. 인증 완료 후 로그인 가능하도록 변경

---

## 📞 문제가 있나요?

오류 메시지와 함께 문의하시면 도와드리겠습니다!
