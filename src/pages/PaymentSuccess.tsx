import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // אחרי 5 שניות הפנה להרשמה
    const timer = setTimeout(() => {
      navigate('/auth');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-background p-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-elegant p-8 text-center">
        <div className="text-6xl mb-4 animate-bounce">✅</div>
        <h1 className="text-3xl font-bold text-primary mb-4">
          התשלום בוצע בהצלחה!
        </h1>
        <p className="text-lg text-foreground mb-6">
          ברוכים הבאים ל-PromptBook! 🎉
        </p>
        <p className="text-muted-foreground mb-8">
          עכשיו תירשמו כדי לקבל גישה מלאה לכל 101 הפרומפטים
        </p>
        
        <Button 
          size="lg"
          className="w-full text-lg mb-4"
          onClick={() => navigate('/auth')}
        >
          המשך להרשמה
        </Button>
        
        <p className="text-sm text-muted-foreground mt-4">
          מועבר אוטומטית בעוד 5 שניות...
        </p>
      </div>
    </div>
  );
}