import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Prompt {
  id: string;
  title: string;
  prompt: string;
  category: string;
  audience: string;
}

const LandingPage = () => {
  const [timeLeft, setTimeLeft] = useState("");
  // const [samplePrompts, setSamplePrompts] = useState<Prompt[]>([]); // הסתרנו את הדוגמאות לפי הפידבק
  const [isPromoActive, setIsPromoActive] = useState(true);
  
  const paypalRan = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    // עדכון תאריך לסוף השנה האזרחית
    const deadline = new Date("2025-12-31T23:59:59").getTime();

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, deadline - now);
      const s = Math.floor(diff / 1000) % 60;
      const m = Math.floor(diff / 1000 / 60) % 60;
      const h = Math.floor(diff / 1000 / 60 / 60) % 24;
      const d = Math.floor(diff / 1000 / 60 / 60 / 24);
      const pad = (n: number) => n.toString().padStart(2, "0");
      const out = (d > 0 ? d + " ימים " : "") + [pad(h), pad(m), pad(s)].join(":");
      setTimeLeft(out);

      if (diff === 0) {
        setIsPromoActive(false);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // הסרנו את שליפת הדוגמאות כדי לשמור על סקרנות

  useEffect(() => {
    if (paypalRan.current) return;
    paypalRan.current = true;

    const loadPaypal = () => {
      // @ts-ignore
      if (window.paypal && window.paypal.HostedButtons) {
        const containerBottom = document.querySelector("#paypal-container-bottom");
        
        if (containerBottom) containerBottom.innerHTML = "";

        // @ts-ignore
        window.paypal.HostedButtons({
          hostedButtonId: "TWSW6SFMDNR72", 
        }).render("#paypal-container-bottom");
      }
    };

    // @ts-ignore
    if (!window.paypal) {
      if (document.querySelector('script[src*="paypal.com/sdk/js"]')) {
         loadPaypal();
         return;
      }
      const script = document.createElement("script");
      script.src = "https://www.paypal.com/sdk/js?client-id=BAA9pb84hA96YyS3MdA-7E4ocZULj8P9L0FNewFBJZ8fMY-Z7Sl17R6RwOGIN2vPVLCgVNKiohWbCbg2Jw&components=hosted-buttons&disable-funding=venmo&currency=ILS";
      script.onload = loadPaypal;
      document.body.appendChild(script);
    } else {
      loadPaypal();
    }
  }, []);

  const scrollToPrice = () => {
    document.getElementById("price-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        :root {
          --font: 'Noto Sans Hebrew', 'Assistant', 'Arial', sans-serif;
          --c1: #0f172a;
          --c2: #ca8a04;
          --bg: #f8fafc;
          --card-bg: #ffffff;
          --danger: #dc2626;
        }
        
        .landing-page {
          font-family: var(--font);
          background: var(--bg);
          color: #1e293b;
          min-height: 100vh;
          overflow-x: hidden;
        }
        
        .wrap {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .landing-header {
          padding: 15px 20px;
          background: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .bar {
          background: var(--c1);
          color: white;
          text-align: center;
          padding: 10px;
          font-weight: bold;
          font-size: 14px;
        }
        
        .hero {
          text-align: center;
          padding: 80px 20px 40px;
          background: white;
        }
        
        .hero h1 {
          font-size: 48px;
          line-height: 1.1;
          color: black;
          font-weight: 900;
          margin-bottom: 20px;
        }
        
        .hero h1 span {
          color: var(--c2);
          display: block;
        }

        .hero p {
            font-size: 20px;
            color: #475569;
            max-width: 700px;
            margin: 0 auto 30px;
            line-height: 1.5;
        }

        .cta-btn {
            background: black;
            color: white;
            font-size: 20px;
            font-weight: bold;
            padding: 15px 40px;
            border-radius: 50px;
            border: none;
            cursor: pointer;
            transition: transform 0.2s;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        .cta-btn:hover {
            transform: scale(1.05);
            background: #333;
        }

        /* סקשן הכאב - הוספה חדשה */
        .pain-section {
            background: #f1f5f9;
            padding: 60px 20px;
            text-align: center;
        }
        .pain-box {
            max-width: 800px;
            margin: 0 auto;
        }
        .pain-box h2 { font-size: 32px; margin-bottom: 20px; }
        .pain-box p { font-size: 18px; line-height: 1.6; margin-bottom: 15px; }

        .solution-section {
            padding: 60px 20px;
            text-align: center;
            background: white;
        }

        .price-box {
          background: #fff; 
          color: black;
          max-width: 500px;
          margin: 40px auto;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          border: 4px solid var(--c2);
          position: relative;
          overflow: hidden;
        }

        .price-box::before {
          content: "סוף שנה";
          position: absolute;
          top: 30px;
          right: -40px;
          background: black;
          color: white;
          font-weight: bold;
          padding: 8px 50px;
          transform: rotate(45deg);
          font-size: 14px;
        }
        
        .price-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin: 20px 0;
        }

        .old-price {
          text-decoration: line-through;
          color: #94a3b8;
          font-size: 28px;
        }

        .new-price {
          font-size: 72px;
          font-weight: 900;
          color: black;
          line-height: 1;
        }

        .bullets li {
          list-style: none;
          background: #f8fafc;
          padding: 15px 20px;
          border-radius: 12px;
          margin-bottom: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 15px;
          text-align: right;
          font-size: 18px;
        }
        
        .bullets li:before {
          content: "✓";
          color: var(--c2);
          font-weight: 900;
          font-size: 24px;
        }

        .about {
          display: flex;
          gap: 30px;
          align-items: center;
          background: black;
          color: white;
          padding: 40px;
          border-radius: 20px;
          margin: 40px 0;
        }
        
        .about img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 4px solid var(--c2);
          object-fit: cover;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .hero h1 { font-size: 36px; }
          .about { flex-direction: column; text-align: center; }
          .cta-btn { width: 100%; }
        }
      `}</style>

      <div className="landing-page" dir="rtl">
        {isPromoActive && (
          <div className="bar">
            <span>✨ מבצע סוף שנה מסתיים בעוד: </span>
            <span className="time">{timeLeft}</span>
          </div>
        )}

        <header className="landing-header">
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <img src="/logo.png" alt="PromptBook" style={{height:'35px'}} />
            <div style={{fontWeight:'800', fontSize:'18px'}}>PromptBook</div>
          </div>
        </header>

        {/* Hero Section: בלי מחיר, רק ההבטחה */}
        <section className="hero">
          <div className="wrap">
            <h1>
              הפכו את ה-AI לקופירייטר
              <span>עם נשמה ישראלית</span>
            </h1>
            <p>
              הספרייה הדיגיטלית הראשונה מסוגה:
              101 נוסחאות ("פרומפטים") מדויקות לכתיבה שיווקית, שעובדות בשיטת "העתק-הדבק".
            </p>
            <button onClick={scrollToPrice} className="cta-btn">
              רוצה לראות איך זה עובד ↓
            </button>
          </div>
        </section>

        {/* Pain Section: הבעיה והכאב */}
        <section className="pain-section">
          <div className="pain-box">
            <h2>למה כל כך קשה לכתוב עם ChatGPT?</h2>
            <p>
              אתם יושבים מול המסך, כותבים לו "תכתוב לי פוסט לפייסבוק", ומקבלים... רובוט.
              <br/>
              טקסט מתורגם, משפטים כמו "צללו לעולם המופלא", ושפה שלא מוכרת לאף אחד.
            </p>
            <p>
              <strong>הבעיה היא לא בכלי. הבעיה היא בהוראה.</strong>
            </p>
            <p>
              כדי שה-AI יכתוב כמו בן אדם, צריך לתת לו "מתכון" (Prompt) מדויק מאוד.
              אבל למי יש זמן ללמוד הנדסת פרומפטים?
            </p>
          </div>
        </section>

        {/* Solution Section: הפתרון וההבהרה */}
        <section className="solution-section">
          <div className="wrap">
            <h2>הכירו את PromptBook: הספרייה הסודית שלכם</h2>
            <p style={{fontSize:'18px', maxWidth:'700px', margin:'0 auto 40px'}}>
              זו לא עוד "בוט" או אפליקציה מסובכת שצריך ללמוד.
              <br/>
              זו ספרייה אינטראקטיבית ופשוטה שמכילה 101 תבניות מוכנות מראש.
            </p>
            
            <ul className="bullets">
              <li>
                  <strong>בוחרים קטגוריה:</strong> פוסטים, מיילים, דפי נחיתה או מודעות.
              </li>
              <li>
                  <strong>מעתיקים את ה"מתכון":</strong> פרומפט מקצועי שכבר נוסה ונבדק.
              </li>
              <li>
                  <strong>מדביקים ב-ChatGPT:</strong> (או בכל כלי אחר) ומשלימים את הפרטים שלכם בסוגריים.
              </li>
              <li>
                  <strong>התוצאה:</strong> טקסט שיווקי מושלם בעברית, בתוך 30 שניות.
              </li>
            </ul>
          </div>
        </section>

        <div className="wrap">
          <section className="about">
            <img 
                src="/pnina-profile.jpg" 
                alt="Pnina Karayoff" 
                onError={(e) => e.currentTarget.style.display = 'none'}
            />
            <div>
              <h2>מי עומדת מאחורי הפרומפטים?</h2>
              <p>נעים להכיר, אני פנינה קריוף. מנטורית AI ומחברת בין טכנולוגיה לאנשים.</p>
              <p>
                אחרי שבניתי עשרות דפי נחיתה וליוויתי מאות בעלות עסקים, פיצחתי את השיטה לגרום ל-AI לכתוב בעברית טבעית ומרגשת.
                את כל הידע הזה, ששווה עשרות אלפי שקלים, זיקקתי לתוך 101 תבניות מוכנות לשימוש.
              </p>
            </div>
          </section>
        </div>

        {/* Price Section: המכירה בסוף */}
        <section id="price-section" className="sec alt" style={{textAlign: 'center', background:'#f8fafc'}}>
          <h2>מוכנים לשדרג את הכתיבה ב-2026?</h2>
          <p style={{fontSize:'18px'}}>בלי מנוי חודשי. בלי אותיות קטנות.</p>
          
          <div className="price-box">
            <div className="save-label">מחיר חיסול 2025 🔥</div>
            <div className="price-display">
              <span className="old-price">397 ₪</span>
              <span className="new-price">99 ₪</span>
            </div>
            <p style={{fontSize:'18px', marginBottom:'20px'}}>תשלום חד פעמי לגישה לכל החיים</p>
            
            <div id="paypal-container-bottom"></div>
            
            <p className="credit-card-note">💳 ניתן לשלם באשראי רגיל (גם ללא חשבון PayPal)</p>
          </div>
          
          <p style={{marginTop:'30px', color:'#666'}}>
            הגישה מיידית מיד לאחר התשלום.
            <br/>
            קבלה נשלחת אוטומטית למייל.
          </p>
        </section>

        <footer>
          © 2025 PromptBook by Pnina Karayoff
          <br /><br />
          <a href="mailto:pninakar@gmail.com">צור קשר</a> | 
          <a href="/terms">תקנון</a>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
