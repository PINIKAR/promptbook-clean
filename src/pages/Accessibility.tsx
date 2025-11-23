import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone } from "lucide-react";

const Accessibility = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8">
          <ArrowRight className="h-4 w-4 ml-2" />
          חזרה
        </Button>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-2">הצהרת נגישות</h1>
          <p className="text-gray-500">PromptBook - מחויבים לכולם</p>
        </div>
        
        <div className="space-y-8 text-gray-700 leading-relaxed text-lg">
          
          <section>
            <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b pb-2">כללי</h2>
            <p>אנו ב-PromptBook רואים חשיבות עליונה במתן שירות שוויוני לכלל הגולשים ובשיפור נגישות האתר לאנשים עם מוגבלויות.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b pb-2">התאמות הנגישות באתר</h2>
            <p className="mb-2">באתר זה בוצעו התאמות נגישות בהתאם להמלצות התקן הישראלי (ת"י 5568) ברמת AA. בין היתר:</p>
            <ul className="list-disc list-inside space-y-1 pr-4">
              <li>האתר מותאם לקריאה באמצעות קורא מסך.</li>
              <li>קיימת ניגודיות צבעים (קונטרסט) ברורה וקריאה.</li>
              <li>האתר מאפשר ניווט מלא באמצעות המקלדת.</li>
              <li>התכנים כתובים בשפה ברורה ופשוטה.</li>
              <li>האתר רספונסיבי ומותאם לשימוש במחשב, טאבלט ונייד.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b pb-2">סייגים לנגישות</h2>
            <p>למרות מאמצינו להנגיש את כלל הדפים באתר, ייתכן ויתגלו חלקים שטרם הונגשו במלואם. אנו ממשיכים במאמצים לשפר את נגישות האתר כחלק ממחויבותנו לאפשר שימוש בו עבור כלל האוכלוסייה.</p>
          </section>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl border border-purple-100 mt-8">
            <h3 className="text-xl font-bold text-purple-700 mb-4">פנייה בנושא נגישות</h3>
            <p className="mb-4">אם נתקלתם בבעיה או שיש לכם הצעה לשיפור, נשמח לשמוע מכם:</p>
            
            <div className="space-y-3 mb-4">
               <p><strong>רכזת הנגישות:</strong> פנינה קריוף</p>
               <div className="flex items-center gap-2">
                <Mail className="text-purple-600 h-5 w-5" />
                <a href="mailto:pninakar@gmail.com" className="text-blue-600 hover:underline">pninakar@gmail.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="text-purple-600 h-5 w-5" />
                <a href="tel:+972548383451" className="text-blue-600 hover:underline">054-8383451</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;