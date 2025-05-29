import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aalqvgrkuixggfjpxjmx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhbHF2Z3JrdWl4Z2dmanB4am14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MDUwMDcsImV4cCI6MjA2NDA4MTAwN30.d5TaUvCCUaa03xhtgXmwXLvv-ibYXSla2aLJ1PuHCdE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);