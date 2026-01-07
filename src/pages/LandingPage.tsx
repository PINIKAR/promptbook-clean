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
        
        .landing-header {
          padding: 20px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
        }

        /* Hero Section - Deep & Vibrant */
        .hero {
            text-align: center; 
            padding: 100px 20px;
            background: var(--dark);
            color: white;
            position: relative;
            overflow: hidden;
        }
        
        .hero::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle at 50% 50%, rgba(147, 62, 199, 0.2) 0%, transparent 70%);
        }

        .hero h1 {
            position: relative;
            z-index: 1;
            margin: 0 auto 25px;
            font-size: 60px;
            line-height: 1.1;
            font-weight: 900;
            letter-spacing: -1px;
        }
        
        .hero p {
            position: relative;
            z-index: 1;
            margin: 0 auto 40px;
            max-width: 800px;
            color: #cbd5e1;
            font-size: 24px;
        }

        .cta-btn {
            position: relative;
            z-index: 1;
            background: var(--grad);
            color: white;
            font-size: 24px;
            font-weight: 800;
            padding: 22px 60px;
            border-radius: 100px;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(147, 62, 199, 0.4);
        }
        .cta-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 15px 40px rgba(147, 62, 199, 0.6);
        }

        /* Features Section - Glass Cards */
        .sec-features {
            background: var(--soft-purple);
            padding: 80px 20px;
        }

        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 40px;
        }

        .feature-card {
            background: white;
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            border: 1px solid #e2e8f0;
            transition: transform 0.3s;
        }
        .feature-card:hover { transform: translateY(-5px); }
        .feature-card .icon { font-size: 30px; margin-bottom: 15px; display: block; }
        .feature-card h3 { margin: 0; font-size: 18px; font-weight: 800; color: var(--c1); }

        /* Teaser Cards */
        .sec-teaser { padding: 80px 20px; }
        .teaser-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 25px;
        }
        .card {
            background: white;
            border-radius: 24px;
            padding: 30px;
            border-right: 6px solid var(--c1);
            box-shadow: 0 15px 35px rgba(0,0,0,0.05);
        }

        /* Testimonials - Slanted Background */
        .sec-testimonials {
            background: var(--dark);
            color: white;
            padding: 80px 20px;
        }
        .testimonial-card {
            background: rgba(255,255,255,0.05);
            padding: 30px;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.1);
            margin-bottom: 20px;
        }

        /* Pricing Section */
        .price-box {
          background: white;
          border-radius: 40px;
          padding: 60px;
          text-align: center;
          border: 2px solid var(--c1);
          margin: 60px auto;
          max-width: 550px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.1);
        }
        .new-price {
          font-size: 90px;
          font-weight: 900;
          background: var(--grad);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .about-sec {
            background: var(--bg-light);
            padding: 80px 20px;
        }
        .about-box {
            display: flex;
            align-items: center;
            gap: 40px;
            background: white;
            padding: 50px;
            border-radius: 40px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.05);
        }
        .about-box img { width: 180px; height: 180px; border-radius: 30px; object-fit: cover; border: 4px solid var(--c1); }

        @media (max-width: 768px) {
            .hero h1 { font-size: 40px; }
            .about-box { flex-direction: column; text-align: center; }
        }
      `}</style>

      <div className="landing-page" dir="rtl">
        <header className="landing-header">
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <img src="/logo.png" alt="PromptBook" style={{height: '40px'}} />
            <div style={{fontWeight:'900', fontSize:'24px', color:'var(--c1)'}}>PromptBook</div>
          </div>
          <button onClick={() => navigate('/auth')} style={{background:'var(--dark)', color:'white', padding:'10px 25px', borderRadius:'100px', border:'none', fontWeight:'800', cursor:'pointer'}}>כניסה</button>
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
            <h2 style={{textAlign:'center', fontSize:'36px', fontWeight:'900', marginBottom:'40px'}}>מה מחכה לכם בפנים?</h2>
            <div className="feature-grid">
              <div className="feature-card">
                <span className="icon">📱</span>
                <h3>אפליקציה אינטראקטיבית</h3>
                <p>10 קטגוריות תוכן בממשק נוח</p>
              </div>
              <div className="feature-card">
                <span className="icon">🔍</span>
                <h3>מנוע חיפוש חכם</h3>
                <p>סינון מהיר לפי קהל יעד</p>
              </div>
              <div className="feature-card">
                <span className="icon">⚡</span>
                <h3>חיסכון בזמן</h3>
                <p>כפתור העתקה מהיר לכל פרומפט</p>
              </div>
              <div className="feature-card">
                <span className="icon">📄</span>
                <h3>ייצוא PDF</h3>
                <p>הורדת כל החוברת למחשב</p>
              </div>
            </div>
          </div>
        </section>

        <section className="sec-teaser">
          <div className="wrap">
            <h2 style={{textAlign:'center', fontSize:'36px', fontWeight:'900', marginBottom:'40px'}}>טעימה מהנוסחאות</h2>
            <div className="teaser-grid">
              <div className="card"><b>כותרת ממירה לדף נחיתה</b><br/>10 וריאציות עם טון רגשי שעובד.</div>
              <div className="card"><b>פתיח אמפתי קצר</b><br/>נוסחה לזיהוי כאב ופתרון לקהל שלך.</div>
              <div className="card"><b>קמפיין השקה</b><br/>בניית רצף טיזרים ודחיפות למכירה.</div>
              <div className="card"><b>פירוק התנגדויות</b><br/>מענה מנצח להתנגדות הגדולה של הלקוח.</div>
              <div className="card"><b>Retargeting חכם</b><br/>מודעות למבקרים שביקרו ולא רכשו.</div>
              <div className="card"><b>FAQ ממיר</b><br/>שאלות ותשובות שמסירות חסמי קנייה.</div>
            </div>
          </div>
        </section>

        <section className="sec-testimonials">
          <div className="wrap">
            <h2 style={{textAlign:'center', fontSize:'36px', fontWeight:'900', marginBottom:'40px'}}>מה אומרים המשתמשים?</h2>
            <div className="testimonial-card">
              <div style={{color:'gold', marginBottom:'10px'}}>★★★★★</div>
              "הכלי הזה חסך לי לפחות 5 שעות כתיבה שבועיות. פשוט מעתיקה ומדביקה."<br/><b>- שירן אליהו, מנהלת סושיאל</b>
            </div>
            <div className="testimonial-card">
              <div style={{color:'gold', marginBottom:'10px'}}>★★★★★</div>
              "מרגיש כאילו שכרתי קופירייטר צמוד לעסק בשבריר מהמחיר."<br/><b>- רן לוי, מאמן אישי</b>
            </div>
          </div>
        </section>

        <section className="about-sec">
          <div className="wrap">
            <div className="about-box">
              <img src="/pnina-profile.jpg" alt="פנינה" />
              <div>
                <h2 style={{color:'var(--c1)', fontWeight:'900'}}>נעים להכיר, פנינה קריוף</h2>
                <p style={{fontSize:'18px'}}>בניתי את PromptBook כי נמאס לי לראות בעלי עסקים נלחמים ב-AI. המטרה שלי היא שתכתבו הרבה פחות, אבל תמכרו הרבה יותר בעזרת נוסחאות מוכחות.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="price-section" className="wrap" style={{textAlign:'center', padding:'80px 20px'}}>
          <div className="price-box">
            <h2 style={{fontWeight:'900', fontSize:'32px', color:'var(--c1)'}}>מוכנים לשדרג את התוכן?</h2>
            <div style={{marginTop:'20px'}}>
              <span style={{textDecoration:'line-through', fontSize:'30px', color:'#94a3b8'}}>397 ₪</span>
              <div className="new-price">99 ₪</div>
            </div>
            <div style={{maxWidth:'300px', margin:'20px auto'}}>
              <div id="paypal-container-bottom"></div>
              <p style={{fontSize:'14px', marginTop:'15px', fontWeight:'700'}}>💳 ניתן לשלם באשראי או ב-PayPal</p>
            </div>
          </div>
        </section>

        <footer style={{textAlign:'center', padding:'40px', background:'#f1f5f9', color:'#64748b'}}>
          © 2026 PromptBook by Pnina Karayoff | <a href="/terms" style={{color:'var(--c1)'}}>תקנון</a>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
