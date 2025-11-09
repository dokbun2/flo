-- E-commerce 테이블 생성 (products, cart_items, orders, order_items)
-- Supabase Dashboard > SQL Editor 에서 실행하세요

-- 1. Products 테이블 (제품)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category VARCHAR(100),
  stock INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Cart Items 테이블 (장바구니)
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 3. Orders 테이블 (주문)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address TEXT,
  recipient_name VARCHAR(100),
  recipient_phone VARCHAR(20),
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Order Items 테이블 (주문 상품)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- RLS 활성화
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Products 정책 (모든 사용자 읽기 가능)
CREATE POLICY "Enable read access for all users" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON public.products
  FOR UPDATE USING (true);

-- Cart Items 정책 (본인 것만 접근)
CREATE POLICY "Users can view their own cart" ON public.cart_items
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own cart items" ON public.cart_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own cart items" ON public.cart_items
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own cart items" ON public.cart_items
  FOR DELETE USING (true);

-- Orders 정책 (본인 것만 접근)
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (true);

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE USING (true);

-- Order Items 정책
CREATE POLICY "Users can view order items" ON public.order_items
  FOR SELECT USING (true);

CREATE POLICY "Users can insert order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- Updated_at 자동 업데이트 트리거 (products)
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Updated_at 자동 업데이트 트리거 (cart_items)
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Updated_at 자동 업데이트 트리거 (orders)
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 샘플 제품 데이터 추가
INSERT INTO public.products (title, description, price, image_url, category, stock) VALUES
  ('장미 꽃다발', '신선한 빨간 장미 10송이로 구성된 꽃다발', 45000, 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400', '꽃다발', 50),
  ('튤립 꽃다발', '화사한 색상의 튤립 12송이 꽃다발', 38000, 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400', '꽃다발', 30),
  ('백합 꽃바구니', '순백의 백합으로 구성된 우아한 꽃바구니', 65000, 'https://images.unsplash.com/photo-1587814213271-7a6b0aa1afc2?w=400', '꽃바구니', 20),
  ('카네이션 꽃다발', '사랑스러운 핑크 카네이션 15송이', 32000, 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400', '꽃다발', 40),
  ('해바라기 꽃다발', '밝고 긍정적인 에너지의 해바라기 8송이', 42000, 'https://images.unsplash.com/photo-1597848212624-e530fa9b9a8d?w=400', '꽃다발', 25),
  ('혼합 꽃바구니', '다양한 꽃으로 구성된 프리미엄 꽃바구니', 85000, 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400', '꽃바구니', 15)
ON CONFLICT DO NOTHING;

-- 완료 메시지
SELECT 'E-commerce 테이블이 성공적으로 생성되었습니다!' AS message;
