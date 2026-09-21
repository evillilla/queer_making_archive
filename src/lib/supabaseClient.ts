import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

// Falls back to a stub client when unconfigured so the app keeps running
// on localStorage-only mode locally instead of crashing at import time.
export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;
