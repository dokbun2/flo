-- orders 테이블에 배송 관련 필드 추가
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS delivery_date DATE,
ADD COLUMN IF NOT EXISTS delivery_photo TEXT,
ADD COLUMN IF NOT EXISTS confirmation_doc TEXT;

-- 기존 데이터가 있을 경우를 위해 NULL 허용
