import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [canLogin, setCanLogin] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // After successful login, update user_id in subscriptions
        await supabase
          .from('user_subscriptions')
          .update({ user_id: session.user.id })
          .eq('email', session.user.email);
        
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkIfPaid = async (emailToCheck: string) => {
    if (!emailToCheck || !emailToCheck.includes('@')) {
      toast({
        title: "שגיאה",
        description: "אנא הזן כתובת אימייל תקינה",
        variant: "destructive",
      });
      return;
    }

    setCheckingPayment(true);
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('has_paid, subscription_expires')
        .eq('email', emailToCheck)
        .maybeSingle();
      
      if (error) throw error;
      
      const hasPaid = data?.has_paid && 
                      (!data.subscription_expires || new Date(data.subscription_expires) > new Date());
      
      if (hasPaid) {
        setCanLogin(true);
        toast({
          title: "מצוין! ✅",
          description: "התשלום אומת. כעת תוכל להתחבר",
        });
      } else {
        toast({
          title: "לא מצאנו תשלום",
          description: "אנא השלם תשלום תחילה או בדוק את כתובת המייל",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "שגיאה בבדיקת תשלום",
        description: error instanceof Error ? error.message : "אירעה שגיאה",
        variant: "destructive",
      });
    } finally {
      setCheckingPayment(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!canLogin) {
      toast({
        title: "נדרש אימות תשלום",
        description: "אנא הזן את המייל ואמת תשלום לפני ההתחברות",
        variant: "destructive",
      });
      return;
    }

    if (!password) {
      toast({
        title: "שגיאה",
        description: "אנא הזן סיסמה",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        toast({
          title: "הרשמה בוצעה בהצלחה!",
          description: "כעת תוכל להתחבר",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }
    } catch (error) {
      toast({
        title: isSignUp ? "שגיאה בהרשמה" : "שגיאה בהתחברות",
        description: error instanceof Error ? error.message : "אירעה שגיאה",
        variant: "destructive",
      });
    }
  };

  const handleGoogleLogin = async () => {
    if (!canLogin) {
      toast({
        title: "נדרש אימות תשלום",
        description: "אנא הזן את המייל ואמת תשלום לפני ההתחברות",
        variant: "destructive",
      });
      return;
    }
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <Logo size="lg" />
            <h1 className="text-3xl font-bold">
              <span className="text-brand-purple">לב</span>
              <span className="text-brand-blue-turquoise">-לבינה</span>
            </h1>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">התחברות / הרשמה</h2>
            <p className="text-muted-foreground">
              קודם אמת שביצעת תשלום, ואז התחבר
            </p>
          </div>

          <div className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">כתובת המייל שאיתה שילמת</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={canLogin}
                className="text-right"
              />
            </div>
            
            {!canLogin && (
              <Button
                onClick={() => checkIfPaid(email)}
                className="w-full"
                disabled={checkingPayment || !email}
              >
                {checkingPayment ? "בודק תשלום..." : "אמת תשלום"}
              </Button>
            )}
          </div>

          {canLogin && (
            <>
              <div className="w-full p-4 bg-primary/10 rounded-lg text-center">
                <p className="text-sm text-primary font-semibold mb-2">✅ התשלום אומת!</p>
                <p className="text-xs text-muted-foreground">כעת תוכל להתחבר</p>
              </div>

              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">סיסמה</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="הזן סיסמה"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-right"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <Label htmlFor="remember" className="cursor-pointer text-sm">
                    זכור אותי
                  </Label>
                </div>

                <Button
                  onClick={handleEmailAuth}
                  className="w-full"
                  disabled={!password}
                >
                  {isSignUp ? "הירשם" : "התחבר"}
                </Button>

                <Button
                  variant="link"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="w-full text-sm"
                >
                  {isSignUp ? "יש לך כבר חשבון? התחבר" : "אין לך חשבון? הירשם"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">או</span>
                  </div>
                </div>

                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full"
                >
                  התחבר עם Google
                </Button>
              </div>
            </>
          )}

          {!canLogin && (
            <Button
              onClick={handleGoogleLogin}
              className="w-full gradient-primary text-white"
              size="lg"
              disabled={!canLogin}
            >
              🔒 אמת תשלום תחילה
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full"
          >
            חזרה לעמוד הראשי
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
