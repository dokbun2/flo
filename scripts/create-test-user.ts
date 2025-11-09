/**
 * 테스트 계정 생성 스크립트
 *
 * 사용법:
 * npx tsx scripts/create-test-user.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// .env.local 파일 로드
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const testEmail = process.env.TEST_USER_EMAIL || 'aitoolbee@gmail.com';
const testPassword = process.env.TEST_USER_PASSWORD || '12345';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUser() {
  try {
    console.log('🌸 테스트 계정 생성 시작...');
    console.log(`📧 이메일: ${testEmail}`);
    console.log(`🔑 비밀번호: ${testPassword}`);
    console.log('');

    // 1. 기존 계정 확인
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', testEmail)
      .single();

    if (existingUser) {
      console.log('⚠️  이미 존재하는 계정입니다. 기존 계정을 삭제하고 다시 생성합니다...');

      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('email', testEmail);

      if (deleteError) {
        console.error('❌ 기존 계정 삭제 실패:', deleteError);
        return;
      }
      console.log('✅ 기존 계정 삭제 완료');
    }

    // 2. 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    // 3. 새 계정 생성
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          email: testEmail,
          name: 'Test User',
          phone: '010-1234-5678',
          hashed_password: hashedPassword,
          role: 'user',
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('❌ 계정 생성 실패:', insertError);
      return;
    }

    console.log('✅ 테스트 계정 생성 완료!');
    console.log('');
    console.log('📋 계정 정보:');
    console.log(`   ID: ${newUser.id}`);
    console.log(`   이메일: ${newUser.email}`);
    console.log(`   이름: ${newUser.name}`);
    console.log(`   전화번호: ${newUser.phone}`);
    console.log(`   역할: ${newUser.role}`);
    console.log('');
    console.log('🎉 이제 로그인 테스트를 진행할 수 있습니다!');
    console.log(`   이메일: ${testEmail}`);
    console.log(`   비밀번호: ${testPassword}`);

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  }
}

createTestUser();
