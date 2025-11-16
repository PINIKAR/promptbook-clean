import { useEffect } from "react";

export default function Paywall() {
  useEffect(() => {
    const onLoad = () => {
      if (window.paypal && window.paypal.HostedButtons) {
        window.paypal.HostedButtons({ hostedButtonId: "TWSW6SFMDNR72" }).render("#paypal-container-top");
        window.paypal.HostedButtons({ hostedButtonId: "TWSW6SFMDNR72" }).render("#paypal-container-bottom");
      }
    };
    if (!document.getElementById("paypal-sdk")) {
      const script = document.createElement("script");
      script.id = "paypal-sdk";
      script.src =
        "https://www.paypal.com/sdk/js?client-id=BAA9pb84hA96YyS3MdA-7E4ocZULj8P9L0FNewFBJZ8fMY-Z7Sl17R6RwOGIN2vPVLCgVNKiohWbCbg2Jw&components=hosted-buttons&disable-funding=venmo&currency=ILS";
      script.onload = onLoad;
      document.body.appendChild(script);
    } else {
      onLoad();
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4 pt-24">{/* Added pt-24 for fixed header */}
      <div className="max-w-lg w-full bg-card rounded-2xl shadow-elegant p-8 text-center border-4 border-primary/20">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-foreground mb-4">תכנים אלו זמינים לחברים בלבד</h1>
        <p className="text-muted-foreground mb-6">הצטרפו ל-1000+ משתמשים שכבר משתמשים ב-101 הפרומפטים שלנו</p>
        <div className="bg-primary/10 p-6 rounded-xl mb-6">
          <div className="text-4xl font-bold text-primary">₪129</div>
          <div className="text-muted-foreground mt-2">תשלום חד-פעמי</div>
        </div>
        <div
          style={{
            background: "#f6f0fa",
            borderRadius: 16,
            padding: 24,
            marginBottom: 32,
            marginTop: 8,
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: 20,
              color: "#933ec7",
            }}
          >
            🚀 קבלו גישה מיידית - רק 129 ₪
          </div>
          <div id="paypal-container-top" style={{ margin: "14px auto 10px" }}></div>
        </div>
        <p className="text-sm text-muted-foreground mb-10">💳 תשלום מאובטח | ✅ גישה מיידית | 🔒 ללא מנוי חודשי</p>
        <div
          style={{
            background: "#f3f9ff",
            borderRadius: 16,
            padding: 22,
            marginTop: "16px",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 18,
              color: "#337cdc",
            }}
          >
            כן, אני רוצה את הכלי עכשיו! 🎯
          </div>
          <div id="paypal-container-bottom" style={{ margin: "14px auto 2px" }}></div>
        </div>
      </div>
    </div>
  );
}
