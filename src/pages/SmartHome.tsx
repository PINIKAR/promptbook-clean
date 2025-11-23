import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import LandingPage from './LandingPage';
import Full from './Full';

export default function SmartHome() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. בדיקה ראשונית מהירה (עם טיימר כדי לא להיתקע)
    const checkSession = async () => {
      try {
        // יצירת טיימר של 2 שניות
        const timeout = new Promise((resolve) => setTimeout(resolve, 2000));
        const authCheck = supabase.auth.getSession();

        // מירוץ: מי עונה קודם?
        // @ts-ignore
        const result: any = await Promise.race([authCheck, timeout]);

        if (result && result.data && result.data.session) {
          setSession(result.data.session);
        }
      } catch (e) {
        console.log("בדיקת התחברות התעכבה");
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // 2. האזנה בזמן אמת - זה מה שגורם להתנתקות לעבוד מיד!
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      
      if (event === 'SIGNED_OUT') {
        setSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // --- הרגע הקובע ---
  // יש סשן (מחובר)? תציג את האפליקציה.
  // אין סשן (התנתק)? תציג את דף הנחיתה.
  if (session) {
    return <Full />;
  }

  return <LandingPage />;
}