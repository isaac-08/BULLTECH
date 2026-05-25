import { createClient } from '@supabase/supabase-js';

// Substitua pelas suas credenciais do Supabase
const supabaseUrl = 'https://ccfazehjglpjbshqugil.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZmF6ZWhqZ2xwamJzaHF1Z2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMDY4MTUsImV4cCI6MjA5NDY4MjgxNX0.wyxUpGKc4E9ZdKRunVlFVGXuPn5uCV2KRoEx_meuBBo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);