import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role?: 'user' | 'admin' | 'super_admin';
  created_at?: string;
}
