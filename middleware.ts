import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin 경로로 시작하는 모든 요청 체크
  if (pathname.startsWith('/admin')) {
    // 클라이언트 측에서 처리하도록 허용
    // 실제 보안은 클라이언트 컴포넌트에서 처리
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
