import { createClient } from '@supabase/supabase-js';

// הכתובת של הפרויקט (מהשלב הקודם)
const SUPABASE_URL = "https://iuwgtlkuodjmjjqojouq.supabase.co";

// המפתח הציבורי שלך (העליון שמצאת)
const SUPABASE_KEY = "sb_publishable_V28PP91BIe-L9qtT19o6PQ_T7wQk2VK";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});