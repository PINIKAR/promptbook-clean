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
        /* איפוס יסודי למניעת פס לבן */
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: #0f172a;
        }

        :root {
          --font: 'Noto Sans Hebrew', sans-serif;
          --c1: #933ec7; 
          --c2: #1e95df; 
          --grad: linear-gradient(135deg, #933ec7 0%, #1e95df 100%);
          --dark: #0f172a;
          --soft-purple: #f5f3ff;
          --bg-light: #f8fafc;
        }
        
        .landing-page {
          font-family: var(--font);
          margin: 0;
          background: #ffffff;
          color: var(--dark);
          line-height: 1.6;
        }

        /* Hero Section - מורחב עד הקצה */
        .hero {
            text-align: center; 
            padding: 0 0 100px 0;
            background: var(--dark);
            color: white;
            position: relative;
            overflow: hidden;
            min-height: 600px;
            margin: 0;
        }
        
        .hero::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle at 50% 50%, rgba(147, 62, 199, 0.35) 0%, transparent 80%);
            z-index: 1;
        }

        .landing-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 40px 60px; /* מרווח פנימי גדול יותר */
          position: relative;
          z-index: 10;
          background: transparent;
        }

        .header-logo-container {
          display: flex;
          align-items: center;
          gap: 20px;
          text-decoration: none;
        }

        .header-logo-img {
          height: 90px; /* הגדלה נוספת */
          width: auto;
          filter: brightness(0) invert(1); /* הופך לוגו כהה ללבן בוהק */
        }

        .header-title {
          color: #ffffff;
          font-weight: 900;
          font-size: 42px; /* הגדלה משמעותית של הטקסט */
          letter-spacing: -1px;
        }

        .login-btn {
          background: #ffffff;
          color: var(--dark);
          padding: 16px 36px;
          border-radius: 100px;
          border: none;
          font-weight: 800;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.4);
        }

        .hero-content {
          position: relative;
          z-index: 10;
          padding: 40px 20px;
        }

        .hero h1 {
            margin: 0 auto 25px;
            font-size: 68px;
            line-height: 1.1;
            font-weight: 900;
        }
        
        .hero p {
            margin: 0 auto 45px;
            max-width: 850px;
            color: #cbd5e1;
            font-size: 26px;
        }

        .cta-btn {
            background: var(--grad);
            color: white;
            font-size: 28px;
            font-weight: 800;
            padding: 24px 80px;
            border-radius: 100px;
            border: none;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 15px 35px rgba(147, 62, 199, 0.5);
        }

        .sec-features { background: var(--soft-purple); padding: 100px 20px; }
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 30px; margin-top: 50px; }
        .feature-card { background: white; padding: 45px 35px; border-radius: 28px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .feature-card .icon { font-size: 42px; margin-bottom: 25px; display: block; }
        .feature-card h3 { margin: 0 0 12px; font-size: 22px; font-weight: 900; color: var(--c1); }

        .sec-teaser { padding: 100px 20px; }
        .teaser-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; }
        .card { background: white; border-radius: 28px; padding: 40px; border-right: 10px solid var(--c1); box-shadow: 0 20px 40px rgba(0,0,0,0.06); }

        .sec-testimonials { background: var(--dark); color: white; padding: 100px 20px; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 35px; }
        .testimonial-card { background: rgba(255,255,255,0.05); padding: 40px; border-radius: 28px; border: 1px solid rgba(255,255,255,0.1); font-style: italic; }

        .price-box { background: white; border-radius: 45px; padding: 80px; text-align: center; border: 2px solid var(--c1); margin: 60px auto; max-width: 600px; }
        .new-price { font-size: 110px; font-weight: 900; background: var(--grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1; }

        .about-box { display: flex; align-items: center; gap: 60px; background: white; padding: 70px; border-radius: 45px; box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
        .about-box img { width: 250px; height: 250px; border-radius: 40px; object-fit: cover; border: 5px solid var(--c1); }

        @media (max-width: 768px) {
            .landing-header { padding: 20px; flex-direction: column; gap: 20px; }
            .header-logo-img { height: 60px; }
            .header-title { font-size: 28px; }
            .hero h1 { font-size: 44px; }
        }
      `}</style>

      <div className="landing-page" dir="rtl">
        <section className="hero">
          <header className="landing-header">
            <a href="/" className="header-logo-container">
              <img src="/logo.png" alt="PromptBook" className="header-logo-img" />
              <div className="header-title">PromptBook</div>
            </a>
            <button onClick={() => navigate('/auth')} className="login-btn">
              כניסה למנויים
            </button>
          </header>

          <div className="hero-content">
            <div className="wrap">
              <h1>מספיק לעבוד בשביל ה-AI:<br/>תנו למנוע של PromptBook לכתוב עבורכם</h1>
              <p>במקום להסתבך עם הגדרות ולהילחם בניסוחים רובוטיים - קבלו גישה לממשק אינטראקטיבי עם 101 נוסחאות קופירייטינג מוכנות מראש.</p>
              <button onClick={scrollToPrice} className="cta-btn">אני רוצה לכתוב פחות ולמכור יותר ↓</button>
            </div>
          </div>
        </section>

        <section className="sec-features">
          <div className="wrap">
            <h2 style={{textAlign:'center', fontSize:'42px', fontWeight:'900', marginBottom:'50px'}}>מה מחכה לכם בפנים?</h2>
            <div className="feature-grid">
              <div className="feature-card">
                <span className="icon">📱</span>
                <h3>אפליקציה אינטראקטיבית</h3>
                <p>10 קטגוריות תוכן בממשק נוח ומעוצב</p>
              </div>
              <div className="feature-card">
                <span className="icon">🔍</span>
                <h3>מנוע חיפוש חכם</h3>
                <p>סינון מהיר לפי קהל יעד בלחיצת כפתור</p>
              </div>
              <div className="feature-card">
                <span className="icon">⚡</span>
                <h3>חיסכון בזמן</h3>
                <p>כפתור העתקה מהיר לכל פרומפט ישירות ל-AI</p>
              </div>
              <div className="feature-card">
                <span className="icon">📄</span>
                <h3>ייצוא PDF מלא</h3>
                <p>אפשרות להוריד את כל החוברת למחשב</p>
              </div>
            </div>
          </div>
        </section>

        <section className="sec-teaser">
          <div className="wrap">
            <h2 style={{textAlign:'center', fontSize:'42px', fontWeight:'900', marginBottom:'50px'}}>טעימה מהנוסחאות</h2>
            <div className="teaser-grid">
              <div className="card"><b>כותרת ממירה לדף נחיתה</b><br/><br/>יצירת 10 וריאציות עם טון רגשי שעובד על הקהל הישראלי.</div>
              <div className="card"><b>פתיח אמפתי קצר</b><br/><br/>נוסחה מדויקת לזיהוי כאב, תקווה ופתרון מהיר.</div>
              <div className="card"><b>קמפיין השקה של 7 ימים</b><br/><br/>בניית רצף טיזרים, עדויות ודחיפות למכירה.</div>
              <div className="card"><b>פירוק התנגדויות עומק</b><br/><br/>מענה מנצח להתנגדות הגדולה ביותר של הלקוח שלך.</div>
              <div className="card"><b>Retargeting חכם</b><br/><br/>3 מודעות רימרקטינג אפקטיביות למבקרים שביקרו ולא רכשו.</div>
              <div className="card"><b>FAQ ממיר ומניע</b><br/><br/>שאלות ותשובות שמסירות חסמי קנייה וכוללות CTA עדין.</div>
            </div>
          </div>
        </section>

        <section className="sec-testimonials">
          <div className="wrap">
            <h2 style={{textAlign:'center', fontSize:'42px', fontWeight:'900', marginBottom:'50px'}}>מה אומרים המשתמשים?</h2>
            <div className="testimonials-grid">
                <div className="testimonial-card">
                  <div style={{color:'gold', marginBottom:'15px', fontSize: '20px'}}>★★★★★</div>
                  "הכלי הזה חסך לי לפחות 5 שעות כתיבה שבועיות. במקום לשבור את הראש, אני פשוט מעתיקה ומדביקה."<br/><br/><b>- שירן אליהו, מנהלת סושיאל</b>
                </div>
                <div className="testimonial-card">
                  <div style={{color:'gold', marginBottom:'15px', fontSize: '20px'}}>★★★★★</div>
                  "פנינה, תודה! זה מרגיש כאילו שכרתי קופירייטר צמוד לעסק בשבריר מהמחיר."<br/><br/><b>- רן לוי, מאמן אישי</b>
                </div>
                <div className="testimonial-card">
                  <div style={{color:'gold', marginBottom:'15px', fontSize: '20px'}}>★★★★★</div>
                  "התוצאות הן עברית נקייה וטבעית. סוף סוף ה-AI מדבר בשפה שמתאימה לקהל הישראלי."<br/><br/><b>- מירב דהן, פרילנסרית</b>
                </div>
            </div>
          </div>
        </section>

        <section className="wrap" style={{padding: '100px 0'}}>
            <div className="about-box">
              <img src="/pnina-profile.jpg" alt="פנינה" />
              <div>
                <h2 style={{color:'var(--c1)', fontWeight:'900', fontSize: '36px', marginBottom: '20px'}}>נעים להכיר, פנינה קריוף</h2>
                <p style={{fontSize:'22px', lineHeight: '1.8'}}>בניתי את PromptBook כי נמאס לי לראות בעלי עסקים נלחמים ב-AI ומקבלים תוצאות בינוניות. המטרה שלי היא שתכתבו הרבה פחות, אבל תמכרו הרבה יותר בעזרת נוסחאות מוכחות ועברית עם נשמה.</p>
              </div>
            </div>
        </section>

        <section id="price-section" className="wrap" style={{textAlign:'center', padding:'100px 20px'}}>
          <div className="price-box">
            <h2 style={{fontWeight:'900', fontSize:'42px', color:'var(--c1)', marginBottom: '15px'}}>מוכנים לשדרג את התוכן?</h2>
            <p style={{fontSize: '24px', color: '#64748b', marginBottom: '40px'}}>השקעה חד פעמית לגישה מלאה לכל החיים</p>
            <div style={{marginBottom:'40px'}}>
              <span style={{textDecoration:'line-through', fontSize:'40px', color:'#94a3b8', marginLeft: '20px'}}>397 ₪</span>
              <div className="new-price">99 ₪</div>
            </div>
            <div style={{maxWidth:'350px', margin:'0 auto'}}>
              <div id="paypal-container-bottom"></div>
              <p style={{fontSize:'18px', marginTop:'25px', fontWeight:'700', color: '#1e293b'}}>💳 ניתן לשלם באשראי או ב-PayPal</p>
            </div>
          </div>
        </section>

        <footer style={{textAlign:'center', padding:'80px 20px', background:'#f8fafc', color:'#64748b', borderTop: '1px solid #e2e8f0'}}>
          © 2026 PromptBook by Pnina Karayoff | <a href="/terms" style={{color:'var(--c1)', fontWeight: '700', textDecoration: 'none'}}>תקנון</a> | <a href="/privacy" style={{color:'var(--c1)', fontWeight: '700', textDecoration: 'none'}}>פרטיות</a>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
