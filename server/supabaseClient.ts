import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY 未设置，数据库功能不可用');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
