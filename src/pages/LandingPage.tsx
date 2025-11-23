import { useEffect, useState } from "react";
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
  const [samplePrompts, setSamplePrompts] = useState<Prompt[]>([]);
  const [isPromoActive, setIsPromoActive] = useState(true);
  const navigate = useNavigate();

  // טיימר לסוף נובמבר
  useEffect(() => {
    const deadline = new Date("2025-11-30T23:59:59").getTime();

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

  // טעינת דוגמאות (אם יש ב-DB, אחרת ישתמש בסטטי)
  useEffect(() => {
    const fetchSamplePrompts = async () => {
      const { data } = await supabase
        .from("prompts")
        .select("*")
        .eq("is_published", true)
        .eq("visible", true)
        .eq("is_sample", true)
        .order("order")
        .limit(6);

      if (data && data.length > 0) {
        setSamplePrompts(data);
      }
    };
    fetchSamplePrompts();
  }, []);

  // פייפאל
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=BAA9pb84hA96YyS3MdA-7E4ocZULj8P9L0FNewFBJZ8fMY-Z7Sl17R6RwOGIN2vPVLCgVNKiohWbCbg2Jw&components=hosted-buttons&disable-funding=venmo&currency=ILS";
    script.onload = () => {
      if (window.paypal?.HostedButtons) {
        // מנקים קודם למקרה של רינדור כפול
        const containerTop = document.querySelector("#paypal-container-top");
        const containerBottom = document.querySelector("#paypal-container-bottom");
        if (containerTop) containerTop.innerHTML = "";
        if (containerBottom) containerBottom.innerHTML = "";

        window.paypal
          .HostedButtons({ hostedButtonId: "TWSW6SFMDNR72" })
          .render("#paypal-container-top");
        window.paypal
          .HostedButtons({ hostedButtonId: "TWSW6SFMDNR72" })
          .render("#paypal-container-bottom");
      }
    };
    document.body.appendChild(script);

    return () => {
      // ניקוי ביציאה
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const getFirstThreeLines = (text: string) => {
    return text.split("\n").filter(Boolean).slice(0, 3).join("\n");
  };

  return (
    <>
      <style>{`
        /* צבעי BLACK FRIDAY */
        :root {
          --font: 'Noto Sans Hebrew', 'Assistant', 'Arial', sans-serif;
          --c1: #0f172a; /* שחור-כחול יוקרתי */
          --c2: #ca8a04; /* זהב */
          --c3: #334155; /* אפור כהה */
          --bg: #f8fafc;
          --card-bg: #ffffff;
          --alt-bg: #f1f5f9;
          --danger: #dc2626; /* אדום למבצע */
        }
        
        .landing-page {
          font-family: var(--font);
          background: var(--bg);
          color: #1e293b;
          min-height: 100vh;
          padding-top: 0; /* הטיימר למעלה */
        }
        
        .wrap {
          max-width: 1050px;
          margin: 0 auto;
          padding: 20px;
        }
        
        /* כותרת עליונה */
        .landing-header {
          padding: 15px 20px;
          background: var(--card-bg);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0; /* מתחת לטיימר אם יש */
          z-index: 40;
        }
        
        .landing-header a.logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        
        .landing-header img {
          height: 40px;
        }
        
        .landing-header .title {
          font-size: 20px;
          font-weight: 800;
          color: var(--c1);
        }

        .login-btn {
            background-color: var(--c1);
            color: var(--c2);
            padding: 8px 20px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            border: 1px solid var(--c2);
            transition: all 0.3s;
        }

        .login-btn:hover {
            background-color: white;
            color: var(--c1);
        }

        /* פס הטיימר */
        .bar {
          background: black;
          color: white;
          text-align: center;
          padding: 10px;
          font-weight: bold;
          font-size: 16px;
          position: relative;
          z-index: 50;
        }
        
        .bar .time {
          color: var(--c2); /* זהב */
          font-family: monospace;
          font-size: 18px;
          margin-right: 10px;
        }

        .promo-badge {
          background-color: var(--danger);
          color: white;
          display: inline-block;
          padding: 6px 16px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .hero {
          text-align: center;
          padding: 60px 20px;
          background: white;
        }
        
        .hero h1 {
          font-size: 42px;
          line-height: 1.2;
          color: var(--c1);
          font-weight: 900;
          margin-bottom: 20px;
        }
        
        .hero h1 span {
          color: var(--c2);
          position: relative;
        }
        
        .hero p {
          font-size: 20px;
          color: var(--c3);
          max-width: 700px;
          margin: 0 auto 40px;
          line-height: 1.6;
        }

        /* קופסת המחיר השחורה */
        .price-box {
          background: var(--c1);
          color: white;
          max-width: 450px;
          margin: 0 auto;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          border: 2px solid var(--c2);
          position: relative;
          overflow: hidden;
        }

        .price-box::before {
          content: "BLACK FRIDAY";
          position: absolute;
          top: 15px;
          right: -30px;
          background: var(--c2);
          color: black;
          font-weight: bold;
          padding: 5px 40px;
          transform: rotate(45deg);
          font-size: 12px;
        }
        
        .price-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .old-price {
          text-decoration: line-through;
          color: #94a3b8;
          font-size: 24px;
        }

        .new-price {
          font-size: 56px;
          font-weight: 900;
          color: white;
          line-height: 1;
        }

        .save-label {
          color: var(--c2);
          font-weight: bold;
          font-size: 18px;
          display: block;
          margin-bottom: 20px;
        }

        .sec {
          border-radius: 16px;
          padding: 40px;
          margin: 40px auto;
          max-width: 1000px;
          background: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        
        .sec.alt {
          background: var(--alt-bg);
          box-shadow: none;
        }
        
        .sec h2 {
          font-size: 28px;
          color: var(--c1);
          margin-bottom: 25px;
          text-align: center;
          font-weight: 800;
        }

        /* רשימת היתרונות */
        .bullets {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        
        .bullets li {
          list-style: none;
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          font-weight: 600;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        
        .bullets li:before {
          content: "✓";
          color: var(--c2);
          font-weight: 900;
          font-size: 20px;
        }

        /* כרטיסיות דוגמה */
        .teaser {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        
        .card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          transition: transform 0.2s;
        }
        
        .card:hover {
          transform: translateY(-5px);
          border-color: var(--c2);
        }
        
        .card b {
          color: var(--c1);
          font-size: 18px;
          display: block;
          margin-bottom: 8px;
        }

        /* עדויות */
        .testimonial {
          text-align: center;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .stars { color: var(--c2); font-size: 20px; margin-bottom: 10px; }

        /* אודות */
        .about {
          display: flex;
          gap: 30px;
          align-items: center;
          background: var(--c1);
          color: white;
          padding: 40px;
          border-radius: 20px;
        }
        
        .about img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 4px solid var(--c2);
          object-fit: cover;
        }
        
        .about h2 { color: var(--c2); text-align: right; margin-bottom: 10px; }
        
        .faq details {
          background: #fff;
          margin-bottom: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .faq summary {
          padding: 15px;
          cursor: pointer;
          font-weight: bold;
          background: #f1f5f9;
        }
        
        .faq div {
          padding: 15px;
          color: #475569;
          line-height: 1.6;
        }

        footer {
          text-align: center;
          padding: 40px 20px;
          background: var(--c1);
          color: #94a3b8;
          font-size: 14px;
        }
        
        footer a {
          color: white;
          text-decoration: none;
          margin: 0 8px;
        }
        
        footer a:hover { color: var(--c2); }

        @media (max-width: 768px) {
          .hero h1 { font-size: 32px; }
          .about { flex-direction: column; text-align: center; }
          .about h2 { text-align: center; }
        }
      `}</style>

      <div className="landing-page" dir="rtl">
        {/* טיימר */}
        {isPromoActive && (
          <div className="bar">
            <span>⚡ BLACK FRIDAY SALE מסתיים בעוד: </span>
            <span className="time">{timeLeft}</span>
          </div>
        )}

        {/* Header */}
        <header className="landing-header">
          <a href="/" className="logo">
            <img src="/logo.png" alt="PromptBook" />
            <div className="title">PromptBook</div>
          </a>
          <button onClick={() => navigate('/auth')} className="login-btn">
            כניסה למנויים
          </button>
        </header>

        {/* HERO SECTION */}
        <section className="hero">
          <div className="wrap">
            <span className="promo-badge">🔥 המחיר הנמוך של השנה</span>
            <h1>
              הפכו את ה-AI לקופירייטר <br />
              <span>עם נשמה ישראלית</span>
            </h1>
            <p>
              101 פרומפטים מדוייקים שהופכים תוכן רובוטי לטקסטים שמוכרים, מרגשים ועובדים בעברית.
              <br />
              <strong>מתאים לכולם: בעלי עסקים, יוצרי תוכן, משווקים ומטפלים.</strong>
            </p>

            {/* קופסת מחיר */}
            <div className="price-box">
              <div className="save-label">חוסכים 268 ₪!</div>
              <div className="price-display">
                <span className="old-price">397 ₪</span>
                <span className="new-price">129 ₪</span>
              </div>
              
              <div id="paypal-container-top"></div>
              
              <p style={{marginTop: '15px', fontSize: '12px', color: '#ccc'}}>
                🔒 תשלום מאובטח | גישה מיידית | ללא מנוי חודשי
              </p>
            </div>
          </div>
        </section>

        {/* מה בפנים */}
        <section className="sec alt">
          <h2>מה מחכה לכם בפנים?</h2>
          <ul className="bullets">
            <li><strong>אפליקציה אינטראקטיבית:</strong> 101 פרומפטים מסודרים ב־10 קטגוריות נוחות</li>
            <li><strong>מנוע חיפוש חכם:</strong> סינון מהיר לפי קהל יעד וקטגוריה</li>
            <li><strong>חיסכון בזמן:</strong> כפתור "העתק" מהיר ושמירת מועדפים</li>
            <li><strong>ייצוא מלא:</strong> אפשרות להוריד את כל החוברת כ-PDF</li>
            <li><strong>מתאים לכולם:</strong> עובד עם ChatGPT, Claude, Gemini</li>
            <li><strong>תשלום חד פעמי:</strong> עדכונים שוטפים ללא דמי מנוי</li>
          </ul>
        </section>

        {/* דוגמאות (Teaser) */}
        <section className="sec">
          <h2>טעימה מהפרומפטים</h2>
          <div className="teaser">
            {samplePrompts.length > 0 ? (
              samplePrompts.map((prompt) => (
                <div key={prompt.id} className="card">
                  <b>{prompt.title}</b>
                  <div style={{fontSize: '14px', color: '#666'}}>
                    {getFirstThreeLines(prompt.prompt)}
                  </div>
                </div>
              ))
            ) : (
              // דוגמאות ברירת מחדל אם ה-DB ריק
              <>
                <div className="card"><b>כותרת ממירה לדף נחיתה</b>יצירת 10 וריאציות עם הבטחת תוצאה וטון רגשי.</div>
                <div className="card"><b>פתיח אמפתי קצר</b>נוסחה לזיהוי כאב, תקווה ופתרון לקהל שלכם.</div>
                <div className="card"><b>קמפיין 7 ימים</b>בניית רצף תוכן להשקה רכה.</div>
                <div className="card"><b>טיפול בהתנגדויות</b>מענה חכם להתנגדות "יקר לי".</div>
              </>
            )}
          </div>
        </section>

        {/* עדויות */}
        <section className="sec alt">
          <h2>מה אומרים אלה שכבר משתמשים?</h2>
          <div className="teaser">
            <div className="testimonial">
              <div className="stars">★★★★★</div>
              "זה שינה לי את העסק. הפרומפטים מדויקים, עמוקים, ובעברית טובה באמת."
              <br /><strong>- דניאל כהן, יועץ עסקי</strong>
            </div>
            <div className="testimonial">
              <div className="stars">★★★★★</div>
              "פנינה, תודה! זה מרגיש כמו ששכרתי קופירייטר צמוד, אבל במחיר בדיחה."
              <br /><strong>- רן לוי, מאמן</strong>
            </div>
            <div className="testimonial">
              <div className="stars">★★★★★</div>
              "התוצאות הן עברית נקייה וטבעית. סוף סוף ה-AI מדבר לקהל הישראלי."
              <br /><strong>- מירב דהן, פרילנסרית</strong>
            </div>
          </div>
        </section>

        {/* אודות */}
        <div className="wrap">
          <section className="about">
            <img src="/pnina-profile.jpg" alt="Pnina Karayoff" />
            <div>
              <h2>נעים להכיר, פנינה קריוף</h2>
              <p style={{lineHeight: '1.6'}}>
                כמוכם, הייתי מתוסכלת מהפער בין כוחו של ה-AI לצורך האמיתי שלנו: 
                <strong>לכתוב תוכן שהוא גם חכם וגם מרגש.</strong>
                <br/><br/>
                את PromptBook בניתי כדי לגשר על הפער הזה. זו לא סתם רשימה, אלא כלי עבודה שמשלב אסטרטגיה שיווקית עם טכנולוגיה, והופך אתכם לקופירייטרים עם רגש. המטרה שלי? שתכתבו פחות, ותמכרו יותר.
              </p>
            </div>
          </section>
        </div>

        {/* שאלות ותשובות */}
        <section className="sec">
          <h2>שאלות נפוצות</h2>
          <div className="faq">
            <details>
              <summary>איך מקבלים גישה?</summary>
              <div>מיד אחרי התשלום, תועברו לאפליקציה ותוכלו להיכנס עם חשבון הגוגל שלכם. הגישה היא מיידית.</div>
            </details>
            <details>
              <summary>האם זה מנוי חודשי?</summary>
              <div>לא! זה תשלום חד-פעמי לכל החיים. כולל כל העדכונים העתידיים.</div>
            </details>
            <details>
              <summary>האם מקבלים קבלה?</summary>
              <div>כמובן. קבלה נשלחת אוטומטית למייל.</div>
            </details>
            <details>
              <summary>זה עובד בחינם עם ChatGPT?</summary>
              <div>כן, הפרומפטים עובדים מעולה גם בגרסה החינמית, וגם ב-Claude וב-Gemini.</div>
            </details>
          </div>
        </section>

        {/* כפתור תחתון וסגירה */}
        <section className="sec alt" style={{textAlign: 'center'}}>
          <h2 style={{marginBottom: '10px'}}>מוכנים לשדרג את השיווק?</h2>
          <p style={{marginBottom: '30px'}}>המחיר יעלה ל-397 ₪ מיד אחרי נובמבר.</p>
          <div style={{maxWidth: '300px', margin: '0 auto'}}>
            <div id="paypal-container-bottom"></div>
          </div>
        </section>

        {/* Footer */}
        <footer>
          © 2025 PromptBook by Pnina Karayoff
          <br /><br />
          <a href="mailto:pninakar@gmail.com">צור קשר</a> |
          <a href="https://wa.me/972548383451" target="_blank" rel="noopener">ווטסאפ</a> |
          <a href="/terms">תקנון</a> |
          <a href="/privacy">מדיניות פרטיות</a> |
          <a href="/accessibility">הצהרת נגישות</a>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;