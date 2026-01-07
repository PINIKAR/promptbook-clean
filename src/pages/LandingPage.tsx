import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const paypalRan = useRef(false);
  const navigate = useNavigate();

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
          --c1: #933ec7; /* סגול ראשי */ 
          --c2: #1e95df; /* כחול טורקיז */ 
          --c3: #337cdc; /* כחול כהה */ 
          --c4: #5f5ad7; 
          --danger: #f86173;
          --text: #111;
          --bg: #fcfcff;
          --card-bg: #ffffff;
          --alt-bg: #f8f9ff;
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

        .hero {
            text-align: center; 
            background: var(--card-bg);
            padding: 80px 20px;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .hero h1 {
            margin: 0 auto 15px;
            font-size: 52px;
            line-height: 1.1;
            color: var(--c1);
            font-weight: 900;
            text-shadow: 2px 2px 10px rgba(147, 62, 199, 0.1); 
        }
        
        .hero p {
            margin: 0 auto 30px;
            max-width: 750px;
            color: #444;
            font-size: 22px;
            font-weight: 600;
        }

        .cta-btn {
            background: var(--c1);
            color: white;
            font-size: 24px;
            font-weight: 800;
            padding: 20px 50px;
            border-radius: 50px;
            border: none;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 10px 25px rgba(147,62,199,0.4);
            text-decoration: none;
            display: inline-block;
        }
        .cta-btn:hover {
            transform: scale(1.05) translateY(-3px);
            box-shadow: 0 15px 35px rgba(147,62,199,0.6);
            background: var(--c3);
        }

        .price-box {
          background: var(--alt-bg);
          border-radius: 30px;
          padding: 50px;
          text-align: center;
          border: 3px solid var(--c1);
          margin-top: 50px;
          max-width: 550px;
          margin-left: auto;
          margin-right: auto;
          box-shadow: 0 25px 70px rgba(147,62,199,0.15);
        }

        .price-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 25px;
        }

        .old-price {
          text-decoration: line-through;
          color: #94a3b8;
          font-size: 35px;
        }

        .new-price {
          font-size: 90px;
          font-weight: 900;
          color: var(--c2);
          line-height: 1;
        }

        .sec {
          border-radius: 25px;
          padding: 40px;
          margin: 40px auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          max-width: 1000px;
          background: var(--card-bg);
        }
        
        .sec.alt { background: var(--alt-bg); }
        
        .sec h2 {
            margin: 0 0 25px;
            font-size: 32px;
            color: var(--c3);
            border-bottom: 2px solid var(--c2);
            display: inline-block;
            padding-bottom: 5px;
            font-weight: 800;
        }

        .teaser {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .card {
            border-radius: 20px;
            padding: 25px; 
            box-shadow: 0 8px 20px rgba(0,0,0,0.08);
            color: var(--text);
            transition: all 0.3s ease;
            background: white;
            border: 1px solid rgba(0,0,0,0.05);
        }
        .card:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0,0,0,0.12); }
        
        .card:nth-child(6n+1) { background-color: #E6E0F1; border-top: 6px solid var(--c1); } 
        .card:nth-child(6n+2) { background-color: #E0F5FF; border-top: 6px solid var(--c2); } 
        .card:nth-child(6n+3) { background-color: #FFE0E5; border-top: 6px solid var(--danger); } 
        .card:nth-child(6n+4) { background-color: #F0F4E8; border-top: 6px solid #88aa33; } 
        .card:nth-child(6n+5) { background-color: #F8F9FF; border-top: 6px solid var(--c4); }
        .card:nth-child(6n+6) { background-color: #FFF9E0; border-top: 6px solid orange; }

        .testimonial {
            background: white;
            border-right: 6px solid var(--c1);
            padding: 25px;
            box-shadow: 5px 8px 25px rgba(0,0,0,0.08);
            margin-bottom: 20px;
            border-radius: 0 15px 15px 0;
            font-style: italic;
        }

        .bullets li {
          list-style: none;
          background: #fff;
          padding: 18px;
          border-radius: 15px;
          border: 2px solid #edf2f7;
          font-weight: 700;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.02);
        }
        .bullets li:before { content: "✨"; font-size: 20px; }

        .about {
          display: flex;
          gap: 40px;
          align-items: center;
          background: #1a1a1a;
          color: white;
          padding: 50px;
          border-radius: 30px;
          margin-bottom: 40px;
        }
        .about h2 { color: var(--c2); margin-top: 0; }
        .about img {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 5px solid var(--c1);
          object-fit: cover;
          box-shadow: 0 0 20px rgba(147, 62, 199, 0.4);
        }

        .login-btn {
            background-color: var(--c3);
            color: white;
            padding: 10px 25px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 800;
            border: none;
            transition: background 0.3s;
        }
        .login-btn:hover { background: var(--c1); }

        .credit-card-note {
            font-size: 15px;
            color: #4a5568;
            margin-top: 20px;
            font-weight: 700;
        }

        .faq details {
            margin-bottom: 15px;
            background: white;
            border-radius: 15px;
            border: 1px solid #edf2f7;
            transition: all 0.3s;
        }
        .faq summary {
            padding: 20px;
            cursor: pointer;
            font-weight: 800;
            color: var(--c1);
            list-style: none;
            position: relative;
        }
        .faq summary:after {
            content: "▼";
            position: absolute;
            left: 20px;
            font-size: 12px;
            color: var(--c2);
        }
        .faq details[open] summary:after { content: "▲"; }

        footer {
            text-align: center;
            padding: 60px 20px;
            background: #f7fafc;
            color: #718096;
            border-top: 1px solid #e2e8f0;
        }
        footer a { color: var(--c3); text-decoration: none; margin: 0 15px; font-weight: 600;}

        @media (max-width: 768px) {
          .hero h1 { font-size: 38px; }
          .hero p { font-size: 18px; }
          .about { flex-direction: column; text-align: center; padding: 30px; }
          .price-box { padding: 30px; }
          .new-price { font-size: 60px; }
        }
      `}</style>

      <div className="landing-page" dir="rtl">
        <header className="landing-header">
          <a href="/" style={{display:'flex', alignItems:'center', textDecoration:'none', gap:'10px'}}>
            <img src="/logo.png" alt="PromptBook" style={{height: '45px'}} />
            <div style={{color: 'var(--c3)', fontWeight:'800', fontSize:'24px'}}>PromptBook</div>
          </a>
          <button onClick={() => navigate('/auth')} className="login-btn">
            כניסה למנויים
          </button>
        </header>

        <section className="hero">
  <div className="wrap">
    <h1>
      מספיק לעבוד בשביל ה-AI: <br/>
      תנו למנוע של PromptBook לכתוב עבורכם
    </h1>
    <p>
      במקום להסתבך עם הגדרות ולהילחם בניסוחים רובוטיים - קבלו גישה לממשק אינטראקטיבי עם 101 נוסחאות קופירייטינג מוכנות. 
      <br/>
      פשוט בוחרים קטגוריה, מעתיקים פרומפט מדויק, ומקבלים טקסט אנושי, חד וממיר תוך שניות.
    </p>

    <button onClick={scrollToPrice} className="cta-btn">
      אני רוצה לכתוב פחות ולמכור יותר ↓
    </button>
  </div>
</section>

        <section className="sec alt">
          <h2>מה מחכה לכם בפנים?</h2>
          <ul className="bullets">
            <li><strong>אפליקציה אינטראקטיבית:</strong> 101 פרומפטים מסודרים ב־10 קטגוריות</li>
            <li><strong>מנוע חיפוש חכם:</strong> סינון מהיר לפי קהל יעד וקטגוריה</li>
            <li><strong>חיסכון בזמן:</strong> כפתור "העתק" מהיר ושמירת מועדפים</li>
            <li><strong>ייצוא מלא:</strong> אפשרות להוריד את כל החוברת כ-PDF</li>
            <li><strong>עדכונים שוטפים:</strong> לכל אורך שנת 2026 ללא תוספת תשלום</li>
          </ul>
        </section>

        <section className="sec">
          <h2>טעימה מהכלי (דוגמאות)</h2>
          <div className="teaser">
              <div className="card"><b>כותרת ממירה לדף נחיתה</b><br/>יצירת 10 וריאציות עם הבטחת תוצאה וטון רגשי.</div>
              <div className="card"><b>פתיח אמפתי קצר</b><br/>נוסחה של 70 מילים לזיהוי כאב, תקווה ופתרון לקהל שלך.</div>
              <div className="card"><b>קמפיין 7 ימים להשקה</b><br/>בניית רצף 7 ימי טיזר, עדות ודחיפות להשקות מוצרים.</div>
              <div className="card"><b>Retargeting חכם</b><br/>3 מודעות רימרקטינג אפקטיביות למבקרים שלא המירו.</div>
              <div className="card"><b>פירוק התנגדות עיקרית</b><br/>מענה בשלושה חלקים להתנגדות הגדולה ביותר למוצר שלך.</div>
              <div className="card"><b>FAQ ממיר</b><br/>6 שאלות ותשובות שמסירות התנגדויות ומכניסות CTA עדין.</div>
          </div>
        </section>

        <section className="sec alt">
          <h2>מה אומרים מי שכבר משתמשים?</h2>
          <div className="teaser">
            <div className="testimonial">
              <div style={{color:'gold', fontSize:'22px', marginBottom: '10px'}}>★★★★★</div>
              "הכלי הזה חסך לי לפחות 5 שעות כתיבה שבועיות. במקום לשבור את הראש, אני פשוט מעתיקה ומדביקה."
              <br /><br /><strong>- שירן אליהו, מנהלת סושיאל</strong>
            </div>
            <div className="testimonial">
              <div style={{color:'gold', fontSize:'22px', marginBottom: '10px'}}>★★★★★</div>
              "פנינה, תודה! זה מרגיש כמו ששכרתי קופירייטר צמוד לעסק, אבל שילמתי פחות משיחת ייעוץ אחת."
              <br /><br /><strong>- רן לוי, מאמן אישי</strong>
            </div>
            <div className="testimonial">
              <div style={{color:'gold', fontSize:'22px', marginBottom: '10px'}}>★★★★★</div>
              "התוצאות הן עברית נקייה וטבעית. סוף סוף ה-AI מדבר בשפה שמתאימה לקהל הישראלי."
              <br /><br /><strong>- מירב דהן, פרילנסרית</strong>
            </div>
          </div>
        </section>

        <div className="wrap">
  <section className="about">
    <img 
        src="/pnina-profile.jpg" 
        alt="פנינה קריוף" 
        onError={(e) => e.currentTarget.style.display = 'none'}
    />
    <div>
      <h2>נעים להכיר, פנינה קריוף</h2>
      <p style={{lineHeight: '1.8', fontSize: '18px'}}>
        שלום, אני פנינה. כמוכם, הייתי מתוסכלת מהפער בין כוחו העצום של ה-AI לבין הצורך האמיתי שלנו כבעלי עסקים: 
        <strong> לכתוב תוכן שהוא גם חכם וגם מרגש, כזה שבאמת נוגע באנשים.</strong>
        <br/><br/>
        את PromptBook בניתי כדי לגשר על הפער הזה – זו לא סתם רשימת הוראות, זו שיטה שמשלבת אסטרטגיה שיווקית, הבנה בעיצוב חווית משתמש וטכנולוגיה מתקדמת. 
        <br/><br/>
        המטרה שלי היא להפוך אתכם לקופירייטרים עם רגש בעזרת הבינה המלאכותית. המטרה הסופית? 
        <strong> שתצטרכו לכתוב הרבה פחות, אבל תצליחו למכור הרבה יותר.</strong>
      </p>
    </div>
  </section>
</div>

        <section id="price-section" className="sec price-box">
          <h2 style={{color:'var(--c1)', marginBottom:'10px', fontSize: '32px'}}>מוכנים לשדרג את התוכן שלכם?</h2>
          <p style={{fontSize:'20px', fontWeight: '600'}}>השקעה חד פעמית לגישה מלאה לכל החיים</p>
          
          <div className="price-display">
             <span className="old-price">397 ₪</span>
             <span className="new-price">99 ₪</span>
          </div>

          <div style={{maxWidth: '320px', margin: '0 auto'}}>
            <div id="paypal-container-bottom"></div>
            <p className="credit-card-note">💳 ניתן לשלם באשראי או ב-PayPal</p>
          </div>
        </section>

        <footer>
          © 2026 PromptBook by Pnina Karayoff
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
