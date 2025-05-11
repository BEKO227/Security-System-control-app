// supabaseClient.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'Your Supabase URl';
const supabaseKey = 'Your Supabase Key';


if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    storage: AsyncStorage as any,
  },
});
