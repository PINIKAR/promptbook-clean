import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone } from "lucide-react";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8 hover:bg-gray-100">
          <ArrowRight className="h-4 w-4 ml-2" />
          חזרה
        </Button>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-2">תקנון שימוש באתר</h1>
          <p className="text-gray-500">ברוכים הבאים לאפליקציית PromptBook</p>
        </div>
        
        <div className="space-y-8 text-gray-700 leading-relaxed text-lg">
          <div className="bg-purple-50 p-6 rounded-xl border-r-4 border-purple-500">
            <strong>השימוש באתר זה כפוף לתנאים המפורטים להלן:</strong>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b pb-2">1. כללי</h2>
            <ul className="list-disc list-inside space-y-2 pr-2">
              <li>אתר זה הוא אתר תדמיתי ושירותי בבעלות פנינה קריוף.</li>
              <li>גלישה באתר והשימוש בו מהווים הסכמה לכל התנאים הרשומים כאן.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b pb-2">2. אחריות</h2>
            <ul className="list-disc list-inside space-y-2 pr-2">
              <li>התוכן באתר נועד לספק מידע בלבד ואינו מהווה המלצה, חוות דעת אישית, או תחליף לייעוץ מקצועי.</li>
              <li>בעלת האתר לא תהיה אחראית לכל נזק שייגרם, במישרין או בעקיפין, משימוש או מהישענות על תכני האתר.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b pb-2">3. קניין רוחני</h2>
            <ul className="list-disc list-inside space-y-2 pr-2">
              <li>כל זכויות היוצרים והקניין הרוחני על התכנים באתר (טקסטים, תמונות, עיצוב, פרומפטים וכו') שמורות לפנינה קריוף, אלא אם צוין אחרת במפורש.</li>
              <li>אין להעתיק, לשכפל או להפיץ את הפרומפטים לשימוש מסחרי ללא אישור.</li>
            </ul>
          </section>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl border border-purple-100 mt-8">
            <h3 className="text-xl font-bold text-purple-700 mb-4">4. פנייה ובירורים</h3>
            <p className="mb-4">לכל שאלה או הבהרה ניתן לפנות:</p>
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

          <p className="text-center text-sm text-gray-400 mt-8">
            תקנון זה מעודכן נכון ליום: נובמבר 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;