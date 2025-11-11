import Link from "next/link";
import { Calendar } from "lucide-react";

export default function EventPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <div className="mb-6">
          <Calendar className="w-20 h-20 mx-auto text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          이벤트 페이지
        </h1>
        <p className="text-gray-600 mb-8">
          곧 다양한 이벤트와 프로모션을 준비 중입니다.
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
