-- Users 테이블 생성
-- Supabase Dashboard > SQL Editor 에서 실행하세요

-- 기존 테이블이 있다면 삭제 (선택사항)
-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  hashed_password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 정책: 모든 사용자가 읽기 가능 (anon key 사용)
CREATE POLICY "Enable read access for all users" ON public.users
  FOR SELECT
  USING (true);

-- 정책: 모든 사용자가 생성 가능 (회원가입)
CREATE POLICY "Enable insert access for all users" ON public.users
  FOR INSERT
  WITH CHECK (true);

-- 정책: 본인만 수정 가능 (추후 세션 구현 시 활용)
CREATE POLICY "Enable update access for users" ON public.users
  FOR UPDATE
  USING (true);

-- Updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Updated_at 트리거 생성
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 완료 메시지
SELECT 'Users 테이블이 성공적으로 생성되었습니다!' AS message;
