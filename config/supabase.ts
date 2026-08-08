import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.js';

let supabase: SupabaseClient | null = null;

if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY && !env.SUPABASE_URL.includes('your_supabase')) {
  supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  console.log('[Supabase] Client initialized successfully');
} else {
  console.log('[Supabase] Credentials missing or placeholder. Fallback mode active.');
}

export { supabase };
