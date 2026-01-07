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

        /* Hero & Header Integration */
        .hero {
            text-align: center; 
            padding: 0 0 100px 0;
            background: var(--dark);
            color: white;
            position: relative;
            overflow: hidden;
            min-height: 650px;
        }
        
        .hero::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle at 50% 50%, rgba(147, 62, 199, 0.4) 0%, transparent 80%);
            z-index: 1;
        }

        .landing-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 40px 60px;
          position: relative;
          z-index: 10;
        }

        .header-logo-container {
          display: flex;
          align-items: center;
          gap: 25px;
          text-decoration: none;
        }

        .header-logo-img {
          height: 110px;
          width: auto;
          filter: brightness(0) invert(1);
          margin-left: 10px;
        }

        .header-title {
          color: #ffffff;
          font-weight: 900;
          font-size: 40px;
          letter-spacing: -1px;
        }

        .login-btn {
          background: #ffffff;
          color: var(--dark);
          padding: 14px 36px;
          border-radius: 100px;
          border: none;
          font-weight: 800;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .hero-content {
          position: relative;
          z-index: 10;
          padding: 60px 20px;
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

        /* Comparison Section */
        .comparison-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-top: 50px;
        }

        /* Sections Styling */
        .sec-features { background: var(--soft-purple); padding: 100px 20px; }
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 30px; margin-top: 50px; }
        .feature-card { background: white; padding: 45px 35px; border-radius: 28px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .feature-card .icon { font-size: 42px; margin-bottom: 25px; display: block; }
        .feature-card h3 { margin: 0 0 12px; font-size: 22px; font-weight: 900; color: var(--c1); }

        .sec-teaser { padding: 100px 20px; }
        .teaser-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; }
        .card { background: white; border-radius: 28px; padding: 40px; border-right: 10px solid var(--c1); box-shadow: 0 20px 40px rgba(0,0,0,0.06); }

        .sec-testimonials { background: var(--dark); color: white; padding: 100px 20px; }
        .testimonial-card { background: rgba(255,255,255,0.05); padding: 40px; border-radius: 28px; border: 1px solid rgba(255,255,255,0.1); font-style: italic; }

        .price-box { background: white; border-radius: 45px; padding: 80px; text-align: center; border: 2px solid var(--c1); margin: 60px auto; max-width: 600px; box-shadow: 0 40px 100px rgba(0,0,0,0.15); }
        .new-price { font-size: 110px; font-weight: 900; background: var(--grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1; }

        /* About Section Box */
        .about-box { display: flex; align-items: center; gap: 60px; background: white; padding: 70px; border-radius: 45px; box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
        .about-box img { width: 250px; height: 250px; border-radius: 40px; object-fit: cover; border: 5px solid var(--c1); }

        @media (max-width: 768px) {
            .landing-header { padding: 25px; flex-direction: column; gap: 20px; }
            .header-logo-img { height: 70px; margin-left: 0; }
            .header-title { font-size: 28px; }
            .hero h1 { font-size: 40px; }
            .hero p { font-size: 18px; }
            .comparison-grid { grid-template-columns: 1fr; }
            .about-box { flex-direction: column; text-align: center; padding: 45px; }
            .about-box img { width: 180px; height: 180px; }
        }
      `}</style>

      <div className="landing-page" dir="rtl">
        <section className="hero">
          <header className="landing-header">
            <a href="/" className="header-logo-container">
              <img src="/logo.png" alt="PromptBook" className="header-logo-img" />
              <div className="header-title">PromptBook</div>
            </a>
            <button onClick={() => navigate('/auth')} className="login-btn">כניסה למנויים</button>
          </header>

          <div className="hero-content">
            <div className="wrap">
              <h1>מספיק לעבוד בשביל ה-AI:<br/>תנו למנוע של PromptBook לכתוב עבורכם</h1>
              <p>במקום להסתבך עם הגדרות ולהילחם בניסוחים רובוטיים - קבלו גישה לממשק אינטראקטיבי עם 101 נוסחאות קופירייטינג מוכנות מראש.</p>
              <button onClick={scrollToPrice} className="cta-btn">אני רוצה לכתוב פחות ולמכור יותר ↓</button>
            </div>
          </div>
        </section>

        {/* ההבדל המוחשי - השוואת כתיבה */}
        <section style={{background: '#fff', padding: '100px 20px'}}>
          <div className="wrap">
            <h2 style={{textAlign:'center', fontSize:'42px', fontWeight:'900', marginBottom:'50px'}}>הנה מה שקורה כשמפסיקים "לנחש" פרומפטים:</h2>
            <div className="comparison-grid">
              <div style={{background: '#f1f5f9', padding: '40px', borderRadius: '32px', border: '2px solid #e2e8f0'}}>
                <div style={{background: '#94a3b8', color: 'white', padding: '5px 15px', borderRadius: '100px', fontSize: '14px', fontWeight: '800', display: 'inline-block', marginBottom: '20px'}}>ChatGPT רגיל</div>
                <h4 style={{fontSize: '20px', marginBottom: '15px'}}>פרומפט גנרי: "תכתוב לי הזמנה לשיחת ייעוץ"</h4>
                <div style={{color: '#64748b', fontStyle: 'italic', lineHeight: '1.6'}}>
                  "היי, האם העסק שלך תקוע? אני מזמין אותך לשיחת ייעוץ חינם שבה נבין את הבעיות שלך ונבנה תוכנית עבודה. אני מומחה בתחום עם ניסיון רב ואשמח לעזור לך להצליח. השאירו פרטים כאן למטה."
                </div>
                <p style={{marginTop: '20px', color: '#f86173', fontWeight: '700'}}>❌ התוצאה: נשמע כמו כולם, יוצר התנגדות מיידית, חסר ערך.</p>
              </div>

              <div style={{background: 'var(--soft-purple)', padding: '40px', borderRadius: '32px', border: '2px solid var(--c1)', boxShadow: '0 20px 40px rgba(147, 62, 199, 0.1)'}}>
                <div style={{background: 'var(--grad)', color: 'white', padding: '5px 15px', borderRadius: '100px', fontSize: '14px', fontWeight: '800', display: 'inline-block', marginBottom: '20px'}}>עם PromptBook</div>
                <h4 style={{fontSize: '20px', marginBottom: '15px'}}>נוסחת "הזדהות וסמכות" מתוך המערכת</h4>
                <div style={{color: 'var(--dark)', fontWeight: '600', lineHeight: '1.6'}}>
                  "תגידו, גם אתם מוצאים את עצמכם מסיימים יום עבודה מתיש, מסתכלים על היומן ולא מבינים למה הפעולות שלכם לא הופכות לכסף בבנק? ב-15 דקות של שיחה ממוקדת, אני לא אמכור לכם כלום - אני פשוט אראה לכם איפה בדיוק נוזל לכם הכסף מהעסק..."
                </div>
                <p style={{marginTop: '20px', color: '#88aa33', fontWeight: '700'}}>✅ התוצאה: פנייה לרגש, הצגת מומחיות בלי 'לדחוף', יצירת סקרנות!</p>
              </div>
            </div>
          </div>
        </section>

        <section className="sec-features">
          <div className="wrap">
            <h2 style={{textAlign:'center', fontSize:'42px', fontWeight:'900', marginBottom:'50px'}}>מה מחכה לכם בפנים?</h2>
            <div className="feature-grid">
              <div className="feature-card"><span className="icon">📱</span><h3>אפליקציה אינטראקטיבית</h3><p>10 קטגוריות תוכן בממשק נוח</p></div>
              <div className="feature-card"><span className="icon">🔍</span><h3>מנוע חיפוש חכם</h3><p>סינון מהיר לפי קהל יעד</p></div>
              <div className="feature-card"><span className="icon">⚡</span><h3>חיסכון בזמן</h3><p>כפתור העתקה מהיר לכל פרומפט</p></div>
              <div className="feature-card"><span className="icon">📄</span><h3>ייצוא PDF מלא</h3><p>אפשרות להוריד את כל החוברת למחשב</p></div>
            </div>
          </div>
        </section>

        {/* מקטע: למה לא פשוט להעתיק תבניות? - מעוצב ומשודרג */}
        <section style={{background: 'var(--dark)', color: 'white', padding: '100px 20px', position: 'relative', overflow: 'hidden'}}>
          <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, background: 'radial-gradient(circle at 50% 50%, var(--c1), transparent 70%)'}}></div>
          <div className="wrap" style={{textAlign: 'center', position: 'relative', zIndex: 2}}>
            <h2 style={{fontSize:'42px', fontWeight:'900', marginBottom:'30px', color: 'white'}}>למה לא פשוט להעתיק תבניות חינמיות מהרשת?</h2>
            <p style={{fontSize: '22px', maxWidth: '900px', margin: '0 auto 40px', lineHeight: '1.8'}}>
              ברשת יש אלפי פרומפטים בחינם, אבל הבעיה פשוטה: הם גנריים. [cite: 5] הם נכתבו במקור באנגלית, עברו תרגום רובוטי ולא לוקחים בחשבון את הניואנסים של הקהל הישראלי, את פסיכולוגיית המכירה או את הקול הייחודי שלכם. [cite: 5, 6]
              <br/><br/>
              ב-PromptBook אתם מקבלים נוסחאות שנוסו, זוקקו והותאמו במיוחד כדי ש-ChatGPT יוציא תוצאה שנשמעת כמו קופירייטר אנושי ומקצועי – כבר מהניסיון הראשון. 
            </p>
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
              <div className="card"><b>Retargeting חכם</b><br/><br/>3 מודעות רימרקטינג אפקטיביות למבקרים שלא רכשו.</div>
              <div className="card"><b>FAQ ממיר ומניע</b><br/><br/>שאלות ותשובות שמסירות חסמי קנייה וכוללות CTA עדין.</div>
            </div>
          </div>
        </section>

        <section className="sec-testimonials">
          <div className="wrap">
            <h2 style={{textAlign:'center', fontSize:'42px', fontWeight:'900', marginBottom:'50px'}}>מה אומרים המשתמשים?</h2>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'30px'}}>
                <div className="testimonial-card"><div style={{color:'gold', marginBottom:'15px'}}>★★★★★</div>"הכלי הזה חסך לי לפחות 5 שעות כתיבה שבועיות. במקום לשבור את הראש, אני פשוט מעתיקה ומדביקה."<br/><br/><b>- שירן אליהו, מנהלת סושיאל</b></div>
                <div className="testimonial-card"><div style={{color:'gold', marginBottom:'15px'}}>★★★★★</div>"פנינה, תודה! זה מרגיש כאילו שכרתי קופירייטר צמוד לעסק בשבריר מהמחיר."<br/><br/><b>- רן לוי, מאמן אישי</b></div>
                <div className="testimonial-card"><div style={{color:'gold', marginBottom:'15px'}}>★★★★★</div>"התוצאות הן עברית נקייה וטבעית. סוף סוף ה-AI מדבר בשפה שמתאימה לקהל הישראלי."<br/><br/><b>- מירב דהן, פרילנסרית</b></div>
            </div>
          </div>
        </section>

        {/* אודות פנינה - משוחזר ומשודרג לפי הקובץ האישי */}
        <section className="about-sec">
          <div className="wrap">
            <div className="about-box">
              <img src="/pnina-profile.jpg" alt="פנינה קריוף" />
              <div>
                <h2 style={{color:'var(--c1)', fontWeight:'900', fontSize: '32px', marginBottom: '20px'}}>מחברת בין עולמות: טיפול. טכנולוגיה. טרנספורמציה. </h2>
                <p style={{fontSize:'19px', lineHeight: '1.8'}}>
                  נעים להכיר, אני פנינה. בעשור האחרון ליוויתי עשרות אנשים במסעות של ריפוי, צמיחה והתמרה דרך NLP, טארוט, נומרולוגיה והעיצוב האנושי. [cite: 4]
                  <br/><br/>
                  אני פונה אליכם – המטפלים, היוצרים, וכל מי שפועל מהלב ומרגיש שהעולם הדיגיטלי רץ קדימה ומשאיר אתכם קצת מאחור. [cite: 4] בינה מלאכותית עשויה להישמע מורכבת או מרוחקת, אבל אני כאן כדי להראות לכם אחרת. [cite: 5]
                  <br/><br/>
                  כ-AI Master שלמדתי מהטובים ביותר (עם עדן ביבס), חקרתי איך הכלים האלו יכולים לשרת אותנו בלי לוותר על מי שאנחנו באמת. [cite: 7, 8] אני מגיעה מהעולם שלכם ומכירה את הדילמות והרגישות. 
                  <br/><br/>
                  <strong>"אני לא מלמדת טכנולוגיה – אני מלמדת אנשים איך לא לפחד ממנה." [cite: 2, 3, 9]</strong> אני כאן כדי להחזיק לכם את היד עד שתעברו את השער לעולם החדש הזה. [cite: 10]
                </p>
              </div>
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
            <div id="paypal-container-bottom"></div>
            <p style={{fontSize:'18px', marginTop:'25px', fontWeight:'700', color: '#1e293b'}}>💳 ניתן לשלם באשראי או ב-PayPal</p>
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
