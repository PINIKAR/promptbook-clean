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
          --font: 'Noto Sans Hebrew', sans-serif;
          --c1: #933ec7; 
          --c2: #1e95df; 
          --grad: linear-gradient(135deg, #933ec7 0%, #1e95df 100%);
          --text: #0f172a;
          --bg: #ffffff;
          --card-bg: rgba(255, 255, 255, 0.8);
          --alt-bg: #f8fafc;
        }
        
        .landing-page {
          font-family: var(--font);
          margin: 0;
          background: var(--bg);
          background-image: 
            radial-gradient(circle at 10% 20%, rgba(147, 62, 199, 0.05) 0%, transparent 20%),
            radial-gradient(circle at 90% 80%, rgba(30, 149, 223, 0.05) 0%, transparent 20%);
          color: var(--text);
          min-height: 100vh;
          line-height: 1.6;
        }
        
        .wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .landing-header {
          padding: 20px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .hero {
            text-align: center; 
            padding: 120px 20px 80px;
            position: relative;
        }
        
        .hero h1 {
            margin: 0 auto 25px;
            font-size: 64px;
            line-height: 1.1;
            font-weight: 900;
            background: var(--grad);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -2px;
        }
        
        .hero p {
            margin: 0 auto 40px;
            max-width: 800px;
            color: #475569;
            font-size: 24px;
            font-weight: 500;
        }

        .cta-btn {
            background: var(--grad);
            color: white;
            font-size: 24px;
            font-weight: 800;
            padding: 22px 60px;
            border-radius: 100px;
            border: none;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 20px 40px rgba(147, 62, 199, 0.2);
            text-decoration: none;
            display: inline-block;
        }
        .cta-btn:hover {
            transform: scale(1.05) translateY(-5px);
            box-shadow: 0 30px 60px rgba(147, 62, 199, 0.3);
        }

        .price-box {
          background: white;
          border-radius: 40px;
          padding: 60px;
          text-align: center;
          border: 1px solid rgba(147, 62, 199, 0.2);
          margin: 60px auto;
          max-width: 600px;
          box-shadow: 0 40px 100px rgba(15, 23, 42, 0.1);
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
          font-size: 100px;
          font-weight: 900;
          background: var(--grad);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
        }

        .sec {
          padding: 80px 20px;
          max-width: 1100px;
          margin: 0 auto;
        }
        
        .sec h2 {
            text-align: center;
            margin-bottom: 50px;
            font-size: 42px;
            font-weight: 900;
            color: #1e293b;
        }

        .teaser {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 25px;
        }
        
        .card {
            background: white;
            border-radius: 32px;
            padding: 35px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.03);
            transition: all 0.4s ease;
            border: 1px solid rgba(0,0,0,0.05);
            position: relative;
            overflow: hidden;
            height: 100%;
        }
        .card:hover { 
          transform: translateY(-15px); 
          box-shadow: 0 40px 80px rgba(0,0,0,0.08); 
        }
        
        .card:nth-child(1) { border-bottom: 8px solid #933ec7; background-color: #f5f3ff; }
        .card:nth-child(2) { border-bottom: 8px solid #1e95df; background-color: #f0f9ff; }
        .card:nth-child(3) { border-bottom: 8px solid #f86173; background-color: #fef2f2; }
        .card:nth-child(4) { border-bottom: 8px solid #88aa33; background-color: #f7fee7; }
        .card:nth-child(5) { border-bottom: 8px solid #5f5ad7; background-color: #f5f3ff; }
        .card:nth-child(6) { border-bottom: 8px solid #ffa500; background-color: #fffbeb; }

        .testimonial {
            background: #f8fafc;
            padding: 40px;
            border-radius: 32px;
            font-style: italic;
            font-size: 20px;
            color: #334155;
            border: 1px solid rgba(0,0,0,0.05);
            border-right: 8px solid var(--c1);
        }

        .bullets {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .bullets li {
          list-style: none;
          background: white;
          padding: 25px;
          border-radius: 24px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.02);
          border: 1px solid rgba(0,0,0,0.03);
        }
        
        .bullets li:before { content: "✨"; font-size: 24px; }

        .about {
          display: flex;
          gap: 40px;
          background: #0f172a;
          color: white;
          padding: 60px;
          border-radius: 48px;
          align-items: center;
        }
        
        .about img {
          width: 200px;
          height: 200px;
          border-radius: 40px;
          object-fit: cover;
          border: 4px solid var(--c1);
        }

        .login-btn {
            background: var(--grad);
            color: white;
            padding: 12px 30px;
            border-radius: 100px;
            text-decoration: none;
            font-weight: 800;
            border: none;
            cursor: pointer;
        }

        .credit-card-note {
            font-size: 16px;
            color: #64748b;
            margin-top: 25px;
            font-weight: 700;
        }

        .faq details {
            margin-bottom: 15px;
            background: white;
            border-radius: 24px;
            border: 1px solid #e2e8f0;
            overflow: hidden;
        }
        
        .faq summary {
            padding: 25px;
            cursor: pointer;
            font-weight: 800;
            color: #1e293b;
            list-style: none;
            position: relative;
        }
        
        .faq summary:after {
            content: "▼";
            position: absolute;
            left: 25px;
            color: var(--c2);
        }

        footer {
            text-align: center;
            padding: 80px 20px;
            background: #f8fafc;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
        }
        
        footer a { color: var(--c1); text-decoration: none; margin: 0 15px; font-weight: 700;}

        @media (max-width: 768px) {
          .hero h1 { font-size: 42px; }
          .hero p { font-size: 20px; }
          .about { flex-direction: column; text-align: center; padding: 40px; }
          .about img { width: 150px; height: 150px; }
          .new-price { font-size: 70px; }
        }
      `}</style>

      <div className="landing-page" dir="rtl">
        <header className="landing-header">
          <a href="/" style={{display:'flex', alignItems:'center', textDecoration:'none', gap:'12px'}}>
            <img src="/logo.png" alt="PromptBook" style={{height: '50px'}} />
            <div style={{color: 'var(--c1)', fontWeight:'900', fontSize:'28px'}}>PromptBook</div>
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
              <div className="card"><b>כותרת ממירה לדף נחיתה</b><br/><br/>יצירת 10 וריאציות עם הבטחת תוצאה וטון רגשי.</div>
              <div className="card"><b>פתיח אמפתי קצר</b><br/><br/>נוסחה של 70 מילים לזיהוי כאב, תקווה ופתרון לקהל שלך.</div>
              <div className="card"><b>קמפיין 7 ימים להשקה</b><br/><br/>בניית רצף 7 ימי טיזר, עדות ודחיפות להשקות מוצרים.</div>
              <div className="card"><b>Retargeting חכם</b><br/><br/>3 מודעות רימרקטינג אפקטיביות למבקרים שלא המירו.</div>
              <div className="card"><b>פירוק התנגדות עיקרית</b><br/><br/>מענה בשלושה חלקים להתנגדות הגדולה ביותר למוצר שלך.</div>
              <div className="card"><b>FAQ ממיר</b><br/><br/>6 שאלות ותשובות שמסירות התנגדויות ומכניסות CTA עדין.</div>
          </div>
        </section>

        <section className="sec alt">
          <h2>מה אומרים מי שכבר משתמשים?</h2>
          <div className="teaser">
            <div className="testimonial">
              <div style={{color:'gold', fontSize:'22px', marginBottom: '15px'}}>★★★★★</div>
              "הכלי הזה חסך לי לפחות 5 שעות כתיבה שבועיות. במקום לשבור את הראש, אני פשוט מעתיקה ומדביקה."
              <br /><br /><strong>- שירן אליהו, מנהלת סושיאל</strong>
            </div>
            <div className="testimonial">
              <div style={{color:'gold', fontSize:'22px', marginBottom: '15px'}}>★★★★★</div>
              "פנינה, תודה! זה מרגיש כמו ששכרתי קופירייטר צמוד לעסק, אבל שילמתי פחות משיחת ייעוץ אחת."
              <br /><br /><strong>- רן לוי, מאמן אישי</strong>
            </div>
            <div className="testimonial">
              <div style={{color:'gold', fontSize:'22px', marginBottom: '15px'}}>★★★★★</div>
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
              <p style={{lineHeight: '1.8', fontSize: '20px'}}>
                שלום, אני פנינה. כמוכם, הייתי מתוסכלת מהפער בין כוחו העצום של ה-AI לבין הצורך האמיתי שלנו כבעלי עסקים: 
                <strong> לכתוב תוכן שהוא גם חכם וגם מרגש, כזה שבאמת נוגע באנשים.</strong>
                <br/><br/>
                את PromptBook בניתי כדי לגשר על הפער הזה – זו שיטה שמשלבת אסטרטגיה שיווקית, הבנה בעיצוב חווית משתמש וטכנולוגיה מתקדמת. המטרה שלי?
                <strong> שתצטרכו לכתוב הרבה פחות, אבל תצליחו למכור הרבה יותר.</strong>
              </p>
            </div>
          </section>
        </div>

        <section id="price-section" className="sec price-box">
          <h2 style={{color:'var(--c1)', marginBottom:'15px', fontSize: '36px'}}>מוכנים לשדרג את התוכן?</h2>
          <p style={{fontSize:'22px', fontWeight: '700', color: '#475569'}}>השקעה חד פעמית לגישה מלאה לכל החיים</p>
          
          <div className="price-display">
             <span className="old-price">397 ₪</span>
             <span className="new-price">99 ₪</span>
          </div>

          <div style={{maxWidth: '350px', margin: '0 auto'}}>
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
