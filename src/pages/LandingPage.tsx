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
  const [isPromoActive, setIsPromoActive] = useState(true);
  
  const paypalRan = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    // תאריך יעד: סוף שנת 2025
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

  const scrollToPrice = () => {
    const element = document.getElementById("price-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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

  return (
    <>
      <style>{`
        :root {
          --font: 'Noto Sans Hebrew', 'Assistant', 'Arial', sans-serif;
          --c1: #933ec7; 
          --c2: #1e95df; 
          --c3: #337cdc; 
          --c4: #5f5ad7; 
          --danger: #f86173;
          --text: #111;
          --bg: #fcfcff;
          --card-bg: #ffffff;
          --alt-bg: #f8f9ff;
        }
        
        @keyframes colorChange {
            0% { background-color: var(--c1); }
            33% { background-color: var(--c2); }
            66% { background-color: var(--c3); }
            100% { background-color: var(--c1); }
        }
        
        .landing-page {
          font-family: var(--font);
          margin: 0;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
        }
        
        .wrap {
          max-width: 1050px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .landing-header {
          padding: 15px 20px;
          border-bottom: 3px solid var(--c2);
          background: var(--card-bg);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 40;
        }

        .bar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--c1); 
          animation: colorChange 15s infinite alternate; 
          color: white;
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: center;
          padding: 14px 12px; 
          font-size: 18px;
          font-weight: 700;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); 
        }
        
        .bar .time {
          font-weight: 900;
          color: yellow;
          font-family: monospace;
        }
        
        .promo-badge {
            background-color: var(--danger);
            color: white;
            display: inline-block;
            padding: 8px 20px;
            border-radius: 50px;
            font-weight: 700;
            font-size: 16px;
            margin-bottom: 20px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }

        .hero {
            text-align: center; 
            background: var(--card-bg);
            padding: 60px 20px;
        }
        
        .hero h1 {
            margin: 0 auto 20px;
            font-size: 48px;
            line-height: 1.2;
            color: var(--c1);
            font-weight: 900;
            text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.05); 
        }
        
        .hero p {
            margin: 0 auto 40px;
            max-width: 750px;
            color: #444;
            font-size: 20px;
            font-weight: 500;
            line-height: 1.6;
        }

        .cta-btn {
            background: var(--c3);
            color: white;
            font-size: 22px;
            font-weight: 800;
            padding: 18px 45px;
            border-radius: 50px;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 10px 25px rgba(51, 124, 220, 0.4);
            text-decoration: none;
            display: inline-block;
        }
        .cta-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 30px rgba(51, 124, 220, 0.6);
            background: var(--c1);
        }

        .price-box {
          background: var(--alt-bg);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          border: 3px solid var(--c1);
          margin-top: 30px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
          position: relative;
          overflow: hidden;
        }

        .price-box::before {
          content: "סוף שנה";
          position: absolute;
          top: 30px;
          right: -40px;
          background: var(--danger);
          color: white;
          font-weight: bold;
          padding: 8px 50px;
          transform: rotate(45deg);
          font-size: 14px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
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
          font-size: 30px;
        }

        .new-price {
          font-size: 80px;
          font-weight: 900;
          color: var(--c2);
          line-height: 1;
        }

        .sec {
          border-radius: 20px;
          padding: 40px;
          margin: 40px auto;
          box-shadow: 0 6px 15px rgba(0,0,0,0.05);
          max-width: 1000px;
          background: var(--card-bg);
        }
        
        .sec.alt {
          background: var(--alt-bg);
          border: 1px solid rgba(30,149,223,0.1);
        }
        
        .sec h2 {
            margin: 0 0 25px;
            font-size: 30px;
            color: var(--c3);
            border-bottom: 2px solid #eee;
            padding-bottom: 15px;
            font-weight: 800;
        }

        .teaser {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        
        .card {
            border-radius: 16px;
            padding: 25px; 
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            color: var(--text);
            transition: transform 0.3s;
            border: 1px solid rgba(0,0,0,0.05);
            background: white;
        }
        
        .card:hover { transform: translateY(-5px); }
        
        .card:nth-child(6n+1) { background-color: #E6E0F1; border-top: 5px solid var(--c1); } 
        .card:nth-child(6n+2) { background-color: #E0F5FF; border-top: 5px solid var(--c2); } 
        .card:nth-child(6n+3) { background-color: #FFE0E5; border-top: 5px solid var(--danger); } 
        .card:nth-child(6n+4) { background-color: #F0F4E8; border-top: 5px solid #88aa33; } 
        .card:nth-child(6n+5) { background-color: #F8F9FF; border-top: 5px solid var(--c4); }
        .card:nth-child(6n+6) { background-color: #FFF9E0; border-top: 5px solid orange; }

        .testimonial {
            background: white;
            border-right: 5px solid var(--c2);
            padding: 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            margin-bottom: 20px;
            border-radius: 12px;
        }

        .bullets li {
          list-style: none;
          background: #fff;
          padding: 15px;
          border-radius: 12px;
          border: 2px solid #f0f0f0;
          font-weight: 700;
          margin-bottom: 12px;
          display: flex;
          align-items: flex-start;
          gap: 15px;
          font-size: 18px;
          line-height: 1.5;
        }
        .bullets li:before { content: "🧡"; font-size: 20px; flex-shrink: 0; }

        .about {
          display: flex;
          gap: 30px;
          align-items: center;
          background: #1a1a1a;
          color: white;
          padding: 50px;
          border-radius: 30px;
        }
        .about h2 { color: var(--c2); border: none; }
        .about img {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 5px solid var(--c1);
          object-fit: cover;
        }

        .login-btn {
            background-color: var(--c3);
            color: white;
            padding: 10px 25px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: bold;
            cursor: pointer;
            border: none;
            transition: all 0.3s;
        }
        .login-btn:hover { background-color: var(--c1); }

        .credit-card-note {
            font-size: 15px;
            color: #555;
            margin-top: 15px;
            font-weight: 700;
            background: white;
            padding: 10px;
            border-radius: 8px;
            display: inline-block;
        }

        .faq details {
            margin-bottom: 15px;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .faq summary {
            padding: 20px;
            cursor: pointer;
            font-weight: 700;
            background: #fff;
            list-style: none;
            position: relative;
            color: var(--c1);
        }
        .faq summary::-webkit-details-marker { display: none; }
        .faq summary:after {
            content: "+";
            position: absolute;
            left: 20px;
            font-size: 24px;
            color: var(--c2);
        }
        .faq details[open] summary:after { content: "-"; }
        .faq details[open] { background: var(--alt-bg); }
        .faq div {
            padding: 0 20px 20px 20px;
            color: #555;
            line-height: 1.6;
        }

        footer {
            text-align: center;
            padding: 40px;
            background: #f0f0f0;
            color: #666;
        }
        footer a { color: var(--c3); text-decoration: none; margin: 0 10px;}

        @media (max-width: 768px) {
          .hero h1 { font-size: 34px; }
          .about { flex-direction: column; text-align: center; padding: 30px; }
          .price-box { padding: 20px; }
          .new-price { font-size: 60px; }
        }
      `}</style>

      <div className="landing-page" dir="rtl">
        {isPromoActive && (
          <div className="bar">
            <span>✨ מבצע סוף שנה (חיסול 2025) מסתיים בעוד: </span>
            <span className="time">{timeLeft}</span>
          </div>
        )}

        <header className="landing-header">
          <a href="/" className="logo" style={{display:'flex', alignItems:'center', textDecoration:'none', gap:'10px'}}>
            <img src="/logo.png" alt="PromptBook" className="logo-img" style={{height: '45px'}} />
            <div className="title" style={{color: 'var(--c3)', fontWeight:'800', fontSize:'22px'}}>PromptBook</div>
          </a>
          <button onClick={() => navigate('/auth')} className="login-btn">
            כניסה למנויים
          </button>
        </header>

        {/* HERO - משופר רגשית */}
        <section className="hero">
          <div className="wrap">
            <span className="promo-badge">✨ מתכוננים ל-2026</span>
            
            <h1>
              נמאס לך שה-AI נשמע כמו רובוט? <br/>
              <span>קבלו את הנשמה הישראלית</span>
            </h1>
            <p>
              אם כל פעם שאתם כותבים ל-ChatGPT יוצא לכם "צללו לעולם המופלא", אתם לא לבד.
              <br/>
              כדי שהטקסט ימכור בעברית, הוא צריך לדעת לדבר בגובה העיניים, עם רגש ועם סלנג ישראלי.
              <br/>
              <strong>וזה בדיוק מה שהספרייה הזו עושה בשבילכם.</strong>
            </p>

            <button onClick={scrollToPrice} className="cta-btn">
              רוצה לראות איך זה עובד ↓
            </button>
          </div>
        </section>

        <section className="sec alt">
          <h2>למה זה שונה מכל מה שהכרתם?</h2>
          <ul className="bullets">
            <li><strong>לא עוד קורס ארוך:</strong> זו ספרייה פרקטית. בוחרים מה רוצים לכתוב (פוסט, מייל, מודעה) ומקבלים "מתכון" מוכן.</li>
            <li><strong>הסוד הוא ב"דוגרי":</strong> הפרומפטים אומנו להוציא מה-AI עברית טבעית, כזאת שלא צריך לשכתב שעות.</li>
            <li><strong>שקט נפשי לשנה החדשה:</strong> במקום לבהות במסך ריק, יש לכם 101 רעיונות מוכנים לשליפה בכל רגע.</li>
            <li><strong>חוסכים אלפי שקלים:</strong> זה כמו להחזיק קופירייטר צמוד בכיס, בלי לשלם ריטיינר חודשי.</li>
            <li><strong>מתאים לכולם:</strong> גם אם אתם לא טכנולוגיים. שיטת "העתק-הדבק" פשוטה שעובדת בכל כלי (ChatGPT, Claude ועוד).</li>
          </ul>
        </section>

        <section className="sec">
          <h2>איזה בעיות זה פותר לכם? (דוגמאות)</h2>
          <div className="teaser">
                <div className="card"><b>"אני צריכה דף נחיתה דחוף"</b><br/>קבלו נוסחה לכותרת וטקסט שגורמים לאנשים להשאיר פרטים, בלי להישמע שיווקיים מידי.</div>
                <div className="card"><b>"איך מתחילים פוסט?"</b><br/>פרומפט ל"פתיח אמפתי" שמזהה את הכאב של הלקוח וגורם לו לקרוא עד הסוף.</div>
                <div className="card"><b>"יש לי השקה בפתח"</b><br/>גאנט תוכן מלא לשבוע שלם: מהטיזר הראשון ועד למכירה, הכל מוכן.</div>
                <div className="card"><b>"לקוחות נוטשים עגלה"</b><br/>מודעות רימרקטינג חכמות שמחזירות את הלקוחות בעדינות ובחיוך.</div>
                <div className="card"><b>"יקר להם..."</b><br/>נוסחה לפירוק התנגדויות בצורה אלגנטית ומכילה, שהופכת "לא" ל"אולי" ואז ל"כן".</div>
                <div className="card"><b>"אין לי כוח לכתוב שאלות ותשובות"</b><br/>פרומפט שמייצר FAQ חכם שגם עונה וגם מוכר את המוצר.</div>
          </div>
        </section>

        <section className="sec alt">
          <h2>מה אומרים מי שכבר ניסו?</h2>
          <div className="teaser">
            <div className="testimonial">
              <div style={{color:'gold', fontSize:'20px'}}>★★★★★</div>
              "הייתי סקפטית שזה יעבוד בעברית, אבל זה פשוט עובד. הטקסטים יוצאים 'עגולים' ונעימים, בלי התרגום המעצבן של גוגל."
              <br /><strong>- שירן ארד, מנהלת סושיאל</strong>
            </div>
            <div className="testimonial">
              <div style={{color:'gold', fontSize:'20px'}}>★★★★★</div>
              "זה לא רק חוסך זמן, זה חוסך תסכול. במקום לריב עם הבוט, אני פשוט מעתיק את הפרומפט של פנינה וזהו."
              <br /><strong>- ירין לוי, מאמן אישי</strong>
            </div>
            <div className="testimonial">
              <div style={{color:'gold', fontSize:'20px'}}>★★★★★</div>
              "ההשקעה הכי טובה שעשיתי השנה לעסק. במחיר של ארוחת צהריים קיבלתי שקט תעשייתי בכתיבת התוכן."
              <br /><strong>- טלי שמש, פרילנסרית</strong>
            </div>
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
              <h2>למה פיתחתי את זה?</h2>
              <p style={{lineHeight: '1.6', fontSize: '18px'}}>
                היי, אני פנינה. כמנטורית AI ומטפלת, ראיתי איך בעלי עסקים מדהימים נופלים דווקא בשלב הכתיבה.
                יש לכם את הידע, יש לכם את הרגש, אבל ה-AI לא מצליח להוציא את זה החוצה.
                <br/><br/>
                את PromptBook בניתי לא כ"מתכנתת", אלא כמי שמבינה אנשים.
                כל פרומפט כאן עבר שיוף ודיוק כדי להבטיח שהתוצאה תהיה כזאת שתרצו לחתום עליה בגאווה.
              </p>
            </div>
          </section>
        </div>

        <section className="sec faq">
          <h2>שאלות ששואלים אותי</h2>
          <details><summary>האם צריך ידע קודם ב-AI?</summary><div>ממש לא. זה כל היופי. האפליקציה בנויה כספרייה ויזואלית. אתם רק צריכים לדעת לעשות "העתק-הדבק".</div></details>
          <details><summary>זה עובד גם בגרסה החינמית של ChatGPT?</summary><div>בהחלט! הפרומפטים נבדקו ועובדים מצוין גם בגרסה החינמית, וגם ב-Claude וב-Gemini.</div></details>
          <details><summary>האם זה מנוי שמתחדש?</summary><div>לא! אני לא אוהבת הפתעות באשראי. התשלום הוא חד-פעמי והגישה נשארת שלכם לתמיד, כולל עדכונים עתידיים.</div></details>
          <details><summary>איך מקבלים גישה?</summary><div>מיד אחרי התשלום המאובטח, המערכת תזהה אתכם ותוכלו להיכנס ולהתחיל לעבוד.</div></details>
        </section>

        {/* SECTION תשלום - מופיע רק כאן */}
        <section id="price-section" className="sec price-box">
          <h2 style={{color:'var(--c1)', marginBottom:'10px'}}>מוכנים לשדרג את העסק ל-2026?</h2>
          <p style={{fontSize:'18px'}}>המחיר עולה ל-397 ₪ ב-1 בינואר.</p>
          
          <div className="price-display">
             <span className="old-price">397 ₪</span>
             <span className="new-price">99 ₪</span>
          </div>

          <div style={{maxWidth: '350px', margin: '0 auto'}}>
            <div id="paypal-container-bottom"></div>
            <p className="credit-card-note">💳 ניתן לשלם באשראי רגיל (גם ללא חשבון PayPal)</p>
          </div>
          
          <p style={{marginTop:'20px', fontSize:'14px', color:'#777'}}>🔒 רכישה מאובטחת וגישה מיידית</p>
        </section>

        <footer>
          © 2025 PromptBook by Pnina Karayoff
          <br /><br />
          <a href="mailto:pninakar@gmail.com">צור קשר</a> |
          <a href="/terms">תקנון</a> |
          <a href="/privacy">מדיניות פרטיות</a>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
