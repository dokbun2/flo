import { Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 월드플라워 섹션 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">월드플라워</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              꽃으로 전하는 진심, 월드플라워와 함께하세요.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-neutral-600 flex items-center justify-center hover:bg-neutral-800 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-neutral-600 flex items-center justify-center hover:bg-neutral-800 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-neutral-600 flex items-center justify-center hover:bg-neutral-800 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* 고객센터 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">고객센터</h3>
            <div className="space-y-2 text-sm">
              <p className="text-neutral-400">
                문의전화: <span className="text-white">1855-4929</span>
              </p>
              <p className="text-neutral-400">
                FAX: <span className="text-white">02-597-1557</span>
              </p>
              <p className="text-neutral-400">
                이메일: <span className="text-white">jungg6842@naver.com</span>
              </p>
              <p className="text-neutral-400 mt-4">
                <a href="#" className="text-white hover:underline">
                  자주 묻는 질문
                </a>
              </p>
            </div>
          </div>

          {/* 회사 정보 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">회사 정보</h3>
            <div className="space-y-2 text-sm text-neutral-400">
              <p>상호: 월드플라워</p>
              <p>대표자: 정석진</p>
              <p>사업자등록번호: 214-90-63551</p>
              <p>통신판매업 신고번호: 제 2016-경기파주-0025호</p>
            </div>
          </div>

          {/* 주소 및 안내 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">주소 및 안내</h3>
            <div className="space-y-2 text-sm text-neutral-400">
              <p>경기도 파주시 문발나루길 54</p>
              <p className="leading-relaxed">
                공동경매장관리소 고사제2000-1504 터틀 사업자 등록본 안내
              </p>
              <p className="text-rose-500 mt-4">
                ※일과 업무 전화시너무 바빠 민 못 드릴때도 있을때도 있음 양해
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-800 mt-8 pt-6 text-center text-sm text-neutral-500">
          <p>Copyright © 2025 - 월드플라워 All Rights Reserved.</p>
          <p className="mt-2">
            Contact{' '}
            <a href="#" className="hover:text-neutral-400 underline">
              webmaster
            </a>{' '}
            for more information.
          </p>
        </div>
      </div>
    </footer>
  );
}
