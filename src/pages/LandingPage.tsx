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
        
        .wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 20px;
        }
        
        /* Header Integrated into Hero */
        .landing-header {
          padding: 25px 40px;
          background: transparent;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .login-btn {
          background: transparent;
          color: white;
          padding: 8px 22px;
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          fontWeight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .login-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: white;
        }

        /* Hero Section - Deep & Vibrant */
        .hero {
            text-align: center; 
            padding: 160px 20px 100px;
            background: var(--dark);
            color: white;
            position: relative;
            overflow: hidden;
        }
        
        .hero::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle at 50% 50%, rgba(147, 62, 199, 0.25) 0%, transparent 70%);
        }

        .hero h1 {
            position: relative;
            z-index: 1;
            margin: 0 auto 25px;
            font-size: 64px;
            line-height: 1.1;
            font-weight: 900;
            letter-spacing: -1px;
        }
        
        .hero p {
            position: relative;
            z-index: 1;
            margin: 0 auto 45px;
            max-width: 800px;
            color: #cbd5e1;
            font-size: 24px;
        }

        .cta-btn {
            position: relative;
            z-index: 1;
            background: var(--grad);
            color: white;
            font-size: 26px;
            font-weight: 800;
            padding: 24px 70px;
            border-radius: 100px;
            border: none;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 15px 35px rgba(147, 62, 199, 0.4);
        }
        .cta-btn:hover {
            transform: scale(1.05) translateY(-5px);
            box-shadow: 0 20px 50px rgba(147, 62, 199, 0.6);
        }

        /* Features Section */
        .sec-features {
            background: var(--soft-purple);
            padding: 100px 20px;
        }

        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 25px;
            margin-top: 50px;
        }

        .feature-card {
            background: white;
            padding: 40px 30px;
            border-radius: 24px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
        }
        .feature-card:hover { transform: translateY(-10px); }
        .feature-card .icon { font-size: 36px; margin-bottom: 20px; display: block; }
        .feature-card h3 { margin: 0 0 10px; font-size: 20px; font-weight: 900; color: var(--c1); }

        /* Teaser Cards */
        .sec-teaser { padding: 100px 20px; }
        .teaser-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 30px;
        }
        .card {
            background: white;
            border-radius: 24px;
            padding: 35px;
            border-right: 8px solid var(--c1);
            box-shadow: 0 20px 40px rgba(0,0,0,0.06);
            transition: all 0.3s ease;
        }
        .card:hover { transform: scale(1.02); }

        /* Testimonials */
        .sec-testimonials {
            background: var(--dark);
            color: white;
            padding: 100px 20px;
        }
        .testimonials-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }
        .testimonial-card {
            background: rgba(255,255,255,0.05);
            padding: 35px;
            border-radius: 24px;
            border: 1px solid rgba(255,255,255,0.1);
            font-style: italic;
        }

        /* Pricing Box */
        .price-box {
          background: white;
          border-radius: 40px;
          padding: 70px;
          text-align: center;
          border: 2px solid var(--c1);
          margin: 60px auto;
          max-width: 580px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.12);
        }
        .new-price {
          font-size: 100px;
          font-weight: 900;
          background: var(--grad);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
        }

        .about-sec {
            background: var(--bg-light);
            padding: 100px 20px;
        }
        .about-box {
            display: flex;
            align-items: center;
            gap: 50px;
            background: white;
            padding: 60px;
            border-radius: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.06);
        }
        .about-box img { width: 220px; height: 220px; border-radius: 35px; object-fit: cover; border: 4px solid var(--c1); }

        @media (max-width: 768px) {
            .hero h1 { font-size: 42px; }
            .hero { padding: 140px 20px 80px; }
            .about-box { flex-direction: column; text-align: center; padding: 40px; }
            .landing-header { padding: 20px; }
        }
      `}</style>

      <div className="landing-page" dir="rtl">
        <header className="landing-header">
          <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
            <img src="/logo.png" alt="PromptBook" style={{height: '45px'}} />
            <div style={{fontWeight:'900', fontSize:'26px', color:'white'}}>PromptBook</div>
          </div>
          <button onClick={() => navigate('/auth')} className="login-btn">כניסה למנויים</button>
        </header>

        <section className="hero">
          <div className="wrap">
            <h1>מספיק לעבוד בשביל ה-AI:<br/>תנו למנוע של PromptBook לכתוב עבורכם</h1>
            <p>במקום להסתבך עם הגדרות ולהילחם בניסוחים רובוטיים - קבלו גישה לממשק אינטראקטיבי עם 101 נוסחאות קופירייטינג מוכנות מראש.</p>
            <button onClick={scrollToPrice} className="cta-btn">אני רוצה לכתוב פחות ולמכור יותר ↓</button>
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

        <section className="about-sec">
          <div className="wrap">
            <div className="about-box">
              <img src="/pnina-profile.jpg" alt="פנינה" />
              <div>
                <h2 style={{color:'var(--c1)', fontWeight:'900', fontSize: '32px'}}>נעים להכיר, פנינה קריוף</h2>
                <p style={{fontSize:'20px', lineHeight: '1.8'}}>בניתי את PromptBook כי נמאס לי לראות בעלי עסקים נלחמים ב-AI ומקבלים תוצאות בינוניות. המטרה שלי היא שתכתבו הרבה פחות, אבל תמכרו הרבה יותר בעזרת נוסחאות מוכחות ועברית עם נשמה.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="price-section" className="wrap" style={{textAlign:'center', padding:'100px 20px'}}>
          <div className="price-box">
            <h2 style={{fontWeight:'900', fontSize:'36px', color:'var(--c1)', marginBottom: '10px'}}>מוכנים לשדרג את התוכן?</h2>
            <p style={{fontSize: '20px', color: '#64748b', marginBottom: '30px'}}>השקעה חד פעמית לגישה מלאה לכל החיים</p>
            <div style={{marginBottom:'30px'}}>
              <span style={{textDecoration:'line-through', fontSize:'35px', color:'#94a3b8', marginLeft: '15px'}}>397 ₪</span>
              <div className="new-price">99 ₪</div>
            </div>
            <div style={{maxWidth:'350px', margin:'0 auto'}}>
              <div id="paypal-container-bottom"></div>
              <p style={{fontSize:'16px', marginTop:'20px', fontWeight:'700', color: '#1e293b'}}>💳 ניתן לשלם באשראי או ב-PayPal</p>
            </div>
          </div>
        </section>

        <footer style={{textAlign:'center', padding:'60px 20px', background:'#f8fafc', color:'#64748b', borderTop: '1px solid #e2e8f0'}}>
          © 2026 PromptBook by Pnina Karayoff | <a href="/terms" style={{color:'var(--c1)', fontWeight: '700', textDecoration: 'none'}}>תקנון</a> | <a href="/privacy" style={{color:'var(--c1)', fontWeight: '700', textDecoration: 'none'}}>פרטיות</a>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
