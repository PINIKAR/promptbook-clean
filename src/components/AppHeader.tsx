import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

const AppHeader = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // בדיקה ראשונית
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkIfAdmin(session);
    });

    // האזנה לשינויים (התחברות/התנתקות)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      checkIfAdmin(session);
      
      // אם התנתקנו - נקה את הסטייט
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setIsAdmin(false);
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // פונקציה שבודקת אם את המנהלת (לפי המייל שלך)
  const checkIfAdmin = (currentSession: Session | null) => {
    if (currentSession?.user?.email === 'pninakar@gmail.com') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // הניווט יקרה אוטומטית בגלל ה-onAuthStateChange למעלה
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-3 border-blue-400 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 transition-transform hover:scale-105 duration-200"
          aria-label="חזרה לדף הבית"
        >
          {/* כאן שמרתי את הלוגו שלך */}
          <img src="/logo.png" alt="PromptBook" className="h-12" />
          <h1 className="text-xl font-bold text-blue-700 hidden md:block">PromptBook – 101 פרומפטים</h1>
        </Link>

        {session && (
          <div className="flex items-center gap-4">
            {/* במובייל נסתיר את המייל כדי לחסוך מקום */}
            <span className="text-sm text-gray-600 hidden md:inline">{session.user.email}</span>
            
            {/* כפתור האדמין - יופיע רק לך! */}
            {isAdmin && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/admin")}
                className="border-blue-600 text-blue-700 hover:bg-blue-50"
              >
                ניהול
              </Button>
            )}
            
            <button 
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              התנתק
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;