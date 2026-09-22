import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://scfwyhdjblupxxkfrgbx.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_pgdvO-2DDQqcJr7w2TgxoQ_At9dkkSk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseApplication {
  id: string;
  name: string;
  email: string;
  message: string;
  usn?: string;
  semester?: string;
  domain?: string;
  created_at: string;
}
