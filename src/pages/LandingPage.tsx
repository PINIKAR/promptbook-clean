import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const paypalRan = useRef(false);
  const navigate = useNavigate();

  // פונקציית גלילה למטה
  const scrollToPrice = () => {
    const element = document.getElementById("price-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // טעינת פייפאל
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
            padding: 60px 20px;
        }
        
        .hero h1 {
            margin: 0 auto 15px;
            font-size: 48px;
            line-height: 1.1;
            color: var(--c1);
            font-weight: 900;
            text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.05); 
        }
        
        .hero p {
            margin: 0 auto 30px;
            max-width: 700px;
            color: #444;
            font-size: 20px;
            font-weight: 600;
        }

        .cta-btn {
            background: var(--c1);
            color: white;
            font-size: 22px;
            font-weight: 800;
            padding: 18px 45px;
            border-radius: 50px;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 10px 25px rgba(147,62,199,0.4);
            text-decoration: none;
            display: inline-block;
        }
        .cta-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 30px rgba(147,62,199,0.6);
            background: var(--c3);
        }

        .price-box {
          background: var(--alt-bg);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          border: 2px solid #e2e8f0;
          margin-top: 30px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.05);
          position: relative;
        }

        .price-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .new-price {
          font-size: 80px;
          font-weight: 900;
          color: var(--c2);
          line-height: 1;
        }

        .sec {
          border-radius: 20px;
          padding: 30px;
          margin: 25px auto;
          box-shadow: 0 6px 15px rgba(0,0,0,0.05);
          max-width: 1000px;
          background: var(--card-bg);
        }
        
        .sec.alt {
          background: var(--alt-bg);
        }
        
        .sec h2 {
            margin: 0 0 20px;
            font-size: 28px;
            color: var(--c3);
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            font-weight: 700;
        }

        .teaser {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 15px;
        }
        
        .card {
            border-radius: 16px;
            padding: 18px; 
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            color: var(--text);
            transition: transform 0.3s;
            background: white;
            border: 1px solid rgba(0,0,0,0.05);
        }
        .card:hover { transform: translateY(-5px); }
        
        .card:nth-child(6n+1) { border-top: 4px solid var(--c1); } 
        .card:nth-child(6n+2) { border-top: 4px solid var(--c2); } 
        .card:nth-child(6n+3) { border-top: 4px solid var(--danger); } 
        .card:nth-child(6n+4) { border-top: 4px solid #88aa33; } 
        .card:nth-child(6n+5) { border-top: 4px solid var(--c4); }
        .card:nth-child(6n+6) { border-top: 4px solid orange; }

        .testimonial {
            background: white;
            border-left: 5px solid var(--c1);
            padding: 20px;
            box-shadow: 2px 4px 10px rgba(0,0,0,0.1);
            margin-bottom: 15px;
        }

        .bullets li {
          list-style: none;
          background: #fff;
          padding: 15px;
          border-radius: 12px;
          border: 1px solid #e0e0e0;
          font-weight: 700;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .bullets li:before { content: "✨"; }

        .about {
          display: flex;
          gap: 30px;
          align-items: center;
          background: #1a1a1a;
          color: white;
          padding: 40px;
          border-radius: 20px;
        }
        .about h2 { color: var(--c2); }
        .about img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 4px solid var(--c1);
          object-fit: cover;
        }

        .login-btn {
            background-color: var(--c3);
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            text-decoration: none;
            font-weight: bold;
            border: none;
        }

        .credit-card-note {
            font-size: 14px;
            color: #666;
            margin-top: 15px;
            font-weight: 600;
        }

        .faq details {
            margin-bottom: 10px;
            background: white;
            border-radius: 12px;
            border: 1px solid #eee;
        }
        .faq summary {
            padding: 15px;
            cursor: pointer;
            font-weight: 700;
            color: var(--c1);
            list-style: none;
            position: relative;
        }
        .faq summary:after {
            content: "+";
            position: absolute;
            left: 20px;
        }

        footer {
            text-align: center;
            padding: 40px;
            background: #f0f0f0;
            color: #666;
        }
        footer a { color: var(--c3); text-decoration: none; margin: 0 10px;}

        @media (max-width: 768px) {
          .hero h1 { font-size: 36px; }
          .about { flex-direction: column; text-align: center; }
        }
      `}</style>

      <div className="landing-page" dir="rtl">
        <header className="landing-header">
          <a href="/" style={{display:'flex', alignItems:'center', textDecoration:'none', gap:'10px'}}>
            <img src="/logo.png" alt="PromptBook" style={{height: '40px'}} />
            <div style={{color: 'var(--c3)', fontWeight:'800', fontSize:'22px'}}>PromptBook</div>
          </a>
          <button onClick={() => navigate('/auth')} className="login-btn">
            כניסה למנויים
          </button>
        </header>

        <section className="hero">
          <div className="wrap">
            <h1>
              הקץ לטקסטים רובוטיים: <br/>
              101 הפרומפטים שמוסיפים נשמה ל-AI שלך
            </h1>
            <p>
              אם ה-AI כותב לכם טקסטים קרים שפשוט לא ממירים, אתם לא לבד.
              הפתרון הוא לא להחליף כלי, אלא את ההוראה.
            </p>

            <button onClick={scrollToPrice} className="cta-btn">
              התחילו לכתוב תוכן שממיר ב-2026
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
            <li><strong>עדכונים שוטפים:</strong> לכל אורך שנת 2026</li>
          </ul>
        </section>

        <section className="sec">
          <h2>טעימה מהכלי (דוגמאות)</h2>
          <div className="teaser">
              <div className="card"><b>כותרת ממירה לדף נחיתה</b><br/>יצירת 10 וריאציות עם הבטחת תוצאה וטון רגשי.</div>
              <div className="card"><b>פתיח אמפתי קצר</b><br/>נוסחה של 70 מילים לזיהוי כאב ופתרון.</div>
              <div className="card"><b>קמפיין 7 ימים להשקה</b><br/>בניית רצף טיזרים ודחיפות להשקות.</div>
              <div className="card"><b>Retargeting חכם</b><br/>3 מודעות רימרקטינג אפקטיביות למבקרים שלא המירו.</div>
              <div className="card"><b>פירוק התנגדות עיקרית</b><br/>מענה להתנגדות הגדולה ביותר למוצר שלך.</div>
              <div className="card"><b>FAQ ממיר</b><br/>שאלות ותשובות שמסירות התנגדויות וכוללות CTA.</div>
          </div>
        </section>

        <section className="sec alt">
          <h2>מה אומרים מי שכבר משתמשים?</h2>
          <div className="teaser">
            <div className="testimonial">
              <div style={{color:'gold', fontSize:'20px'}}>★★★★★</div>
              "הכלי הזה חסך לי לפחות 5 שעות כתיבה שבועיות. במקום לשבור את הראש, אני פשוט מעתיקה ומדביקה."
              <br /><strong>- יעל כץ, מנהלת סושיאל</strong>
            </div>
            <div className="testimonial">
              <div style={{color:'gold', fontSize:'20px'}}>★★★★★</div>
              "פנינה, תודה! זה מרגיש כמו ששכרתי קופירייטר צמוד לעסק, אבל שילמתי פחות משיחת ייעוץ אחת."
              <br /><strong>- רן לוי, מאמן אישי</strong>
            </div>
          </div>
        </section>

        <div className="wrap">
          <section className="about">
            <img src="/pnina-profile.jpg" alt="Pnina Karayoff" onError={(e) => e.currentTarget.style.display = 'none'} />
            <div>
              <h2>נעים להכיר, פנינה קריוף</h2>
              <p style={{lineHeight: '1.6', fontSize: '16px'}}>
                את PromptBook בניתי כדי לגשר על הפער בין ה-AI לבין כתיבה מרגשת.
                זו שיטה שמשלבת אסטרטגיה וטכנולוגיה כדי שתוכלו לכתוב פחות, ולמכור יותר.
              </p>
            </div>
          </section>
        </div>

        <section id="price-section" className="sec price-box">
          <h2 style={{color:'var(--c1)', marginBottom:'10px'}}>מוכנים לשדרג את התוכן שלכם?</h2>
          <p style={{fontSize:'18px'}}>השקעה חד פעמית לגישה מלאה לכל החיים</p>
          
          <div className="price-display">
             <span className="new-price">129 ₪</span>
          </div>

          <div style={{maxWidth: '300px', margin: '0 auto'}}>
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
