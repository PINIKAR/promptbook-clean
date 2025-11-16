import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import LandingPage from './LandingPage';
import Full from './Full';
import Paywall from './Paywall';

export default function SmartHome() {
  const [view, setView] = useState<'loading' | 'landing' | 'app' | 'paywall'>('loading');
  
  useEffect(() => {
    checkUserStatus();
  }, []);
  
  async function checkUserStatus() {
    // בדיקה 1: האם המשתמש מחובר?
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      // לא מחובר → הצג דף נחיתה
      setView('landing');
      return;
    }
    
    const user = session.user;
    
    // Bypass לאדמין - בדיקה מהדאטהבייס
    const { data: adminData } = await supabase
      .from('admins')
      .select('email')
      .eq('email', user.email)
      .single();
    
    if (adminData) {
      setView('app');
      return;
    }
    
    // בדיקה 2: האם המשתמש שילם?
    const { data } = await supabase
      .from('user_subscriptions')
      .select('has_paid, subscription_expires')
      .eq('user_id', user.id)
      .maybeSingle();
    
    const hasPaid = data?.has_paid && 
                    (!data.subscription_expires || new Date(data.subscription_expires) > new Date());
    
    if (hasPaid) {
      // מחובר + שילם → הצג אפליקציה
      setView('app');
    } else {
      // מחובר אבל לא שילם → הצג מסך חסימה
      setView('paywall');
    }
  }
  
  if (view === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 to-white pt-20">
        <div className="text-2xl font-bold text-purple-600 animate-pulse">טוען...</div>
      </div>
    );
  }
  
  if (view === 'landing') return <LandingPage />;
  if (view === 'app') return <Full />;
  if (view === 'paywall') return <Paywall />;
  
  return null;
}