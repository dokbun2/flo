-- users 테이블의 role 제약 조건 업데이트
-- 기존 제약 조건 삭제
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- 새로운 제약 조건 추가 (super_admin 포함)
ALTER TABLE users ADD CONSTRAINT users_role_check
CHECK (role IN ('user', 'admin', 'super_admin'));

-- dokbun2@gmail.com을 super_admin으로 업데이트
UPDATE users
SET role = 'super_admin'
WHERE email = 'dokbun2@gmail.com';
