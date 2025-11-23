import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone, Search, PenTool, Trash, ShieldAlert } from "lucide-react";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8">
          <ArrowRight className="h-4 w-4 ml-2" />
          חזרה
        </Button>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-2">מדיניות פרטיות</h1>
          <p className="text-gray-500">PromptBook - לב לבינה</p>
        </div>
        
        <div className="space-y-10 text-gray-700 leading-relaxed">
          
          <div className="bg-yellow-50 border-r-4 border-yellow-400 p-6 rounded-lg">
            <p className="text-yellow-800 font-bold mb-2">חשוב לדעת:</p>
            <p className="text-yellow-900">
              אנו מכבדים את פרטיותכם ומחויבים לשמור על המידע האישי שלכם. מדיניות זו מפרטת כיצד אנו אוספים, משתמשים ומגנים על המידע שלכם.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-blue-600 mb-6 border-r-4 border-purple-500 pr-3">1. איזה מידע נאסף</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-50/50 p-6 rounded-xl border-r-2 border-purple-300">
                <h3 className="text-lg font-bold text-blue-600 mb-2">📊 מצב נוכחי</h3>
                <p>האפליקציה אוספת רק את כתובת המייל לצורך התחברות וזיהוי מנוי. איננו אוספים מידע רגיש נוסף.</p>
              </div>
              <div className="bg-purple-50/50 p-6 rounded-xl border-r-2 border-purple-300">
                <h3 className="text-lg font-bold text-blue-600 mb-2">📧 יצירת קשר</h3>
                <p>ניתן ליצור קשר באמצעות המייל או הטלפון המופיעים באתר בלבד.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-600 mb-4 border-r-4 border-purple-500 pr-3">2. שימוש עתידי במידע</h2>
            <p>ייתכן שבעתיד יתווספו לאתר:</p>
            <ul className="list-disc list-inside pr-4 mt-2 space-y-1">
              <li>אפשרויות להשארת פרטים וטפסי יצירת קשר</li>
              <li>שימוש בקוקיות (Cookies) לצרכים טכנולוגיים</li>
              <li>מערכות לשיפור חווית המשתמש</li>
              <li>כלי ניתוח סטטיסטי (Google Analytics וכדומה)</li>
            </ul>
            <p className="mt-4 font-medium">במקרה כזה, מדיניות הפרטיות תעודכן בהתאם ותפורסם באתר.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-600 mb-6 border-r-4 border-purple-500 pr-3">3. זכויותיכם</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg flex gap-3 items-start">
                <Search className="text-purple-600 h-6 w-6 shrink-0" />
                <div>
                  <h3 className="font-bold text-blue-600">צפייה במידע</h3>
                  <p className="text-sm">זכותכם לדעת אילו נתונים נשמרים עליכם</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex gap-3 items-start">
                <PenTool className="text-purple-600 h-6 w-6 shrink-0" />
                <div>
                  <h3 className="font-bold text-blue-600">תיקון מידע</h3>
                  <p className="text-sm">זכותכם לבקש תיקון מידע שגוי</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex gap-3 items-start">
                <Trash className="text-purple-600 h-6 w-6 shrink-0" />
                <div>
                  <h3 className="font-bold text-blue-600">מחיקת מידע</h3>
                  <p className="text-sm">זכותכם לבקש מחיקת המידע שלכם</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex gap-3 items-start">
                <ShieldAlert className="text-purple-600 h-6 w-6 shrink-0" />
                <div>
                  <h3 className="font-bold text-blue-600">התנגדות</h3>
                  <p className="text-sm">זכותכם להתנגד לשימושים מסוימים</p>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl border border-purple-100 mt-8">
            <h3 className="text-xl font-bold text-purple-700 mb-4">📞 פנייה בנושאי פרטיות</h3>
            <p className="mb-4">לכל שאלה בנושא פרטיות, מחיקת מידע, או בירור, ניתן לפנות:</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="text-purple-600 h-5 w-5" />
                <strong>מייל:</strong> 
                <a href="mailto:pninakar@gmail.com" className="text-blue-600 hover:underline">pninakar@gmail.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="text-purple-600 h-5 w-5" />
                <strong>טלפון:</strong> 
                <a href="tel:+972548383451" className="text-blue-600 hover:underline">054-8383451</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;