import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // מצב הרשמה או התחברות

  useEffect(() => {
    // אם כבר מחוברים - מעיף לדף הבית
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/");
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate("/");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (error) {
      toast({
        title: "שגיאה בהתחברות",
        description: error instanceof Error ? error.message : "נסה שוב",
        variant: "destructive",
      });
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // הרשמה
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({ title: "נרשמת בהצלחה!", description: "כעת אתה מחובר" });
      } else {
        // התחברות
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({ title: "התחברת בהצלחה!" });
      }
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: error.message === "Invalid login credentials" 
          ? "שם משתמש או סיסמה שגויים" 
          : error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md p-8 shadow-xl border-t-4 border-purple-600">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">כניסה למנויים</h1>
          <p className="text-gray-500">הכנסו כדי לגשת לספר הפרומפטים</p>
        </div>

        {/* כפתור גוגל - האופציה המועדפת */}
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full flex gap-3 justify-center py-6 text-lg border-gray-300 hover:bg-gray-50 mb-6"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          התחברות עם Google
        </Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">או במייל רגיל</span></div>
        </div>

        {/* טופס מייל וסיסמה */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-2">
            <Label>כתובת אימייל (איתה שילמת)</Label>
            <Input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-left" 
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label>סיסמה</Label>
            <Input 
              type="password" 
              required 
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-left" 
              dir="ltr"
            />
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6" disabled={loading}>
            {loading ? "מעבד..." : (isSignUp ? "הירשם והיכנס" : "התחבר")}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-purple-600 hover:underline"
          >
            {isSignUp ? "יש לך כבר חשבון? לחץ להתחברות" : "פעם ראשונה? לחץ להרשמה"}
          </button>
        </div>
        
        <Button variant="link" onClick={() => navigate('/')} className="w-full mt-2 text-gray-400">
          חזרה לדף הבית
        </Button>
      </Card>
    </div>
  );
};

export default Auth;