import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qvhvkgcfmzyzzlhlrgyz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2aHZrZ2NmbXp5enpsaGxyZ3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NjU0MDcsImV4cCI6MjEwNzA0MTQwN30.dXJHyX0WSrjfLRjqqTw8TjNvFJCxoEXP-NN-gOQqlFg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
