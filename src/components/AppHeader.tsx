import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import Logo from "./Logo";
import type { Session } from "@supabase/supabase-js";

const AppHeader = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session and check admin status
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      
      if (session) {
        const { data: adminData } = await supabase
          .from('admins')
          .select('email')
          .eq('email', session.user.email)
          .single();
        
        setIsAdmin(!!adminData);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session) {
        const { data: adminData } = await supabase
          .from('admins')
          .select('email')
          .eq('email', session.user.email)
          .single();
        
        setIsAdmin(!!adminData);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-3 border-blue-400 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 transition-transform hover:scale-105 duration-200"
          aria-label="חזרה לדף הבית"
        >
          <img src="/logo.png" alt="PromptBook" className="h-12" />
          <h1 className="text-xl font-bold text-blue-700">PromptBook – 101 פרומפטים</h1>
        </Link>

        {session && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session.user.email}</span>
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
                אדמין
              </Button>
            )}
            <button 
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700"
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
