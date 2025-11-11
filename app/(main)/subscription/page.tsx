import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <div className="mb-6">
          <RefreshCw className="w-20 h-20 mx-auto text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          정기구독 페이지
        </h1>
        <p className="text-gray-600 mb-8">
          매주 신선한 꽃을 받아보실 수 있는 정기구독 서비스를 준비 중입니다.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
