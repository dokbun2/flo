# 🌸 회원/장바구니/주문 기능 구현 가이드

## 📋 구현 완료 항목

### ✅ 1. 데이터베이스 스키마
- **파일**: `database_schema.sql`
- **테이블**:
  - `users`: 사용자 정보 (role 필드 포함)
  - `products`: 상품 정보
  - `cart_items`: 장바구니 아이템
  - `orders`: 주문 정보
  - `order_items`: 주문 상품 상세

### ✅ 2. 회원 관리 기능
- **파일**: `app/admin/users/page.tsx`
- **기능**:
  - 전체 회원 목록 조회
  - 회원 검색 (이름, 이메일, 전화번호)
  - 관리자 권한 부여/해제
  - 회원 통계 (전체/일반/관리자/오늘 가입)

### ✅ 3. 장바구니 Context
- **파일**: `contexts/CartContext.tsx`
- **기능**:
  - 로그인 사용자: DB에 저장
  - 비로그인 사용자: localStorage 사용
  - 장바구니 추가/삭제/수량 변경
  - 장바구니 합계 계산
  - Header에 실시간 아이템 수 표시

### ✅ 4. 관리자 권한 시스템
- **파일**: `app/admin/layout.tsx`, `middleware.ts`
- **기능**:
  - 로그인 체크
  - 관리자 역할 체크
  - 권한 없으면 자동 리다이렉트
  - 로딩 UI 표시

---

## 🚧 구현 필요 항목

### 1. 장바구니 페이지 (`/cart`)
**생성 필요**: `app/(main)/cart/page.tsx`

**기능 요구사항**:
```typescript
- 장바구니 아이템 목록 표시
- 수량 증가/감소 버튼
- 아이템 삭제 버튼
- 총 금액 계산 표시
- "주문하기" 버튼 → 결제 페이지로 이동
```

### 2. 결제/주문 페이지 (`/checkout`)
**생성 필요**: `app/(main)/checkout/page.tsx`

**기능 요구사항**:
```typescript
- 배송 정보 입력 폼
  - 수령인 이름
  - 전화번호
  - 배송 주소
  - 배송 메시지
  - 희망 배송일
- 주문 상품 목록 표시
- 총 결제 금액
- 결제 수단 선택
- "결제하기" 버튼
- 주문 완료 후:
  - orders 테이블에 주문 저장
  - order_items 테이블에 주문 상품 저장
  - 장바구니 비우기
  - 주문 완료 페이지로 이동
```

### 3. 주문 완료 페이지 (`/order/complete`)
**생성 필요**: `app/(main)/order/complete/page.tsx`

**기능 요구사항**:
```typescript
- 주문번호 표시
- 주문 내역 요약
- "주문 내역 보기" 버튼
- "홈으로" 버튼
```

### 4. 마이페이지 - 주문 내역 (`/account`)
**수정 필요**: `app/(main)/account/page.tsx` 생성

**기능 요구사항**:
```typescript
- 로그인 체크
- 사용자 정보 표시
- 주문 내역 목록:
  - 주문번호, 주문일, 상품명, 금액, 상태
  - 최신순 정렬
  - 상세 보기 버튼
- 주문 상세 모달:
  - 주문 상품 목록
  - 배송 정보
  - 배송 현황
```

### 5. 상품 상세 페이지 업데이트
**수정 필요**: `app/(main)/products/[id]/page.tsx`

**추가 기능**:
```typescript
- "장바구니 담기" 버튼
- 수량 선택 input
- useCart().addToCart() 호출
- 성공 시 토스트 메시지
```

### 6. 상품 카드 컴포넌트 업데이트
**수정 필요**: `components/domain/product/ProductCard.tsx`

**추가 기능**:
```typescript
- "장바구니" 버튼 추가
- 클릭 시 장바구니에 1개 추가
- 성공 시 피드백 표시
```

### 7. 어드민 - 실제 주문 관리
**수정 필요**: `app/admin/page.tsx`

**변경사항**:
```typescript
// 현재: OrderContext의 mock 데이터 사용
// 변경: Supabase orders 테이블에서 실제 주문 가져오기

const fetchOrders = async () => {
  const { data } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (title, image_url)
      )
    `)
    .order('created_at', { ascending: false });
};
```

---

## 🗄️ Supabase 설정

### 1. 데이터베이스 테이블 생성
Supabase SQL Editor에서 `database_schema.sql` 파일 내용 실행

### 2. Row Level Security (RLS) 설정

**현재 상태**: RLS 비활성화 (개발 단계)

**프로덕션 권장 설정**:
```sql
-- Users 테이블: 자신의 정보만 조회/수정 가능
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Cart Items: 자신의 장바구니만 접근
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart"
  ON cart_items FOR ALL
  USING (auth.uid() = user_id);

-- Orders: 자신의 주문만 조회
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- 관리자는 모든 데이터 접근 가능
CREATE POLICY "Admins can view all"
  ON orders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## 🔧 구현 순서 권장사항

### Phase 1: 장바구니 UI (30분)
1. ✅ CartContext 생성 (완료)
2. ✅ Header에 카트 수 표시 (완료)
3. 장바구니 페이지 생성
4. ProductCard에 "장바구니 담기" 버튼 추가

### Phase 2: 주문/결제 (1시간)
5. 결제 페이지 생성
6. 주문 API 엔드포인트 생성 (`app/api/orders/route.ts`)
7. 주문 완료 페이지 생성

### Phase 3: 마이페이지 (30분)
8. 마이페이지/주문 내역 페이지 생성
9. 주문 상세 모달 생성

### Phase 4: 어드민 통합 (30분)
10. 어드민 주문 관리 실제 DB 연동
11. ✅ 회원 관리 페이지 (완료)

---

## 📁 파일 구조

```
app/
├── (main)/
│   ├── cart/
│   │   └── page.tsx          # 장바구니 페이지 (생성 필요)
│   ├── checkout/
│   │   └── page.tsx          # 결제 페이지 (생성 필요)
│   ├── account/
│   │   └── page.tsx          # 마이페이지 (생성 필요)
│   └── order/
│       └── complete/
│           └── page.tsx      # 주문 완료 (생성 필요)
├── admin/
│   ├── users/
│   │   └── page.tsx          # 회원 관리 (✅ 완료)
│   └── page.tsx              # 주문 관리 (수정 필요)
└── api/
    └── orders/
        └── route.ts          # 주문 API (생성 필요)

contexts/
├── AuthContext.tsx           # ✅ 완료
├── CartContext.tsx           # ✅ 완료
└── OrderContext.tsx          # 수정 필요

database_schema.sql           # ✅ 완료
```

---

## 🎯 다음 단계

1. **장바구니 페이지 구현** - 가장 우선순위 높음
2. **상품 카드에 장바구니 버튼 추가**
3. **결제/주문 페이지 구현**
4. **마이페이지 주문 내역 구현**
5. **어드민 실제 주문 데이터 연동**

---

## 💡 참고사항

- 모든 금액은 원(₩) 단위로 저장 (INTEGER)
- 주문번호 형식: `ORD-YYYYMMDD-XXX` (예: ORD-20250107-001)
- 배송 상태: 접수완료 → 배송중 → 배송완료
- 비로그인 사용자도 장바구니 사용 가능 (localStorage)
- 로그인 시 로컬 장바구니 → DB 마이그레이션 필요

---

## 📞 문의사항

구현 중 문제가 있으면 SETUP_GUIDE.md 참고하거나 문의하세요!
