// supabaseClient.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qbgypzbzjedeiqnqmslp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiZ3lwemJ6amVkZWlxbnFtc2xwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTk3NjMxMiwiZXhwIjoyMDUxNTUyMzEyfQ.X6JRmr0oC_gKShQSvGo0-EUDD_APYeZSOHTMhm2WI2k';


if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    storage: AsyncStorage as any,
  },
});