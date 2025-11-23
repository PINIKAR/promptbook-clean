import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // בדיקה אם כבר מחוברים - אם כן, עוף למסך הראשי
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (error) {
      toast({
        title: "שגיאה בהתחברות",
        description: error instanceof Error ? error.message : "אירעה שגיאה",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center shadow-xl border-t-4 border-purple-500">
        <div className="flex flex-col items-center gap-6">
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">ברוכים הבאים</h1>
            <p className="text-gray-500">התחברו כדי לגשת לספר הפרומפטים</p>
          </div>

          {/* כפתור ההתחברות היחיד והקובע */}
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full flex gap-3 justify-center py-6 text-lg border-gray-300 hover:bg-gray-50 transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            התחברות עם Google
          </Button>

          <p className="text-xs text-gray-400 mt-4">
            הגישה למנויים שרכשו את המוצר בלבד
          </p>
          
          <Button 
            variant="link" 
            className="text-sm text-purple-600"
            onClick={() => navigate('/')}
          >
            חזרה לדף הבית
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;