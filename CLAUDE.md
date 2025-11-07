# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Flo"는 꽃집 전자상거래 웹사이트입니다. Next.js 16 (React 19), TypeScript, Tailwind CSS 4를 사용하여 구축되었습니다.

## Development Commands

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **React**: v19 (최신)
- **TypeScript**: v5.9
- **Styling**: Tailwind CSS v4 (postcss 기반)
- **UI Libraries**:
  - `lucide-react` (아이콘)
  - `embla-carousel-react` (캐러셀)
- **Utilities**:
  - `clsx` + `tailwind-merge` (className 병합)

## Architecture

### Directory Structure

```
app/
  ├── (main)/           # Main route group
  │   ├── layout.tsx    # Header + Footer 레이아웃
  │   └── page.tsx      # 홈페이지
  ├── globals.css       # Tailwind + 테마 설정
  └── layout.tsx        # Root layout (메타데이터)

components/
  ├── domain/
  │   └── product/      # 제품 관련 도메인 컴포넌트
  ├── homepage/         # 홈페이지 전용 컴포넌트
  └── layout/           # 레이아웃 컴포넌트

lib/
  └── utils.ts          # 공통 유틸리티 (cn, formatPrice)

public/
  └── placeholder-product.svg  # 이미지 fallback
```

### Component Organization

**도메인 기반 구조**: 컴포넌트는 용도에 따라 분류됩니다:
- `components/domain/`: 도메인 로직과 밀접한 컴포넌트 (예: ProductCard)
- `components/homepage/`: 홈페이지 전용 섹션 컴포넌트
- `components/layout/`: 레이아웃 관련 컴포넌트 (Header, Footer)

### Route Groups

`app/(main)/` 사용: 괄호 폴더는 URL에 영향을 주지 않으면서 레이아웃을 공유합니다.

### Key Patterns

1. **Server Components 우선**: 기본적으로 Server Components를 사용하며, 인터랙션이 필요한 경우에만 `"use client"` 지시어를 추가합니다.

2. **Client Components**: 다음 경우에 사용됩니다:
   - 캐러셀 (Embla Carousel)
   - 이미지 에러 핸들링
   - 마우스 이벤트 (hover, click)

3. **Image Optimization**: Next.js Image 컴포넌트 사용:
   - `fill` prop으로 부모 컨테이너 채우기
   - `sizes` prop으로 반응형 이미지 최적화
   - 에러 핸들링으로 placeholder 이미지 표시

4. **Styling Convention**:
   - Tailwind CSS v4의 새로운 `@theme` 지시어 사용
   - `lib/utils.ts`의 `cn()` 함수로 조건부 클래스 병합
   - 커스텀 색상: `primary-*`, `neutral-*`

5. **Price Formatting**: `formatPrice()` 유틸리티 사용 (₩ 및 천단위 구분)

6. **Mock Data**: 현재 모든 제품 데이터는 `page.tsx`에 하드코딩되어 있습니다 (개발 단계).

## Tailwind CSS v4 Notes

이 프로젝트는 Tailwind CSS v4를 사용하며, v3와 다른 점이 있습니다:

- `tailwind.config.js` 없음 (PostCSS 기반)
- `globals.css`에서 `@theme` 블록으로 테마 정의
- `@import "tailwindcss"` 사용

## Path Aliases

TypeScript path alias 설정:
- `@/*` → 프로젝트 루트

예: `@/components/...`, `@/lib/utils`

## Image Configuration

Next.js config에서 모든 외부 이미지 호스트 허용 (`hostname: '**'`). 프로덕션에서는 특정 도메인으로 제한할 것.

## Common Development Tasks

### 새 컴포넌트 추가

1. 적절한 폴더에 배치:
   - 재사용 가능한 도메인 컴포넌트 → `components/domain/`
   - 페이지 전용 컴포넌트 → `components/{pagename}/`

2. Client 기능이 필요한 경우에만 `"use client"` 추가

3. TypeScript 인터페이스를 Props로 정의하고 export

### 스타일링

- `cn()` 유틸리티로 조건부 클래스 병합
- 커스텀 색상은 `globals.css`의 `@theme` 블록에 추가
- 반응형: `sm:`, `md:`, `lg:` 등 Tailwind 브레이크포인트 사용

### 이미지 처리

```tsx
import Image from "next/image";

// 반응형 이미지
<Image
  src={imageUrl}
  alt="description"
  fill
  className="object-cover"
  sizes="(max-width: 640px) 50vw, 33vw"
/>
```

## Future Considerations

현재 프로젝트는 초기 단계이며 다음이 필요할 수 있습니다:

- API 통합 (제품 데이터)
- 상태 관리 (장바구니, 사용자)
- 인증 시스템
- 제품 상세 페이지
- 장바구니/결제 기능
- Header 컴포넌트 구현 (현재 placeholder)
