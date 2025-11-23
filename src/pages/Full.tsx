import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Copy, Search, Heart, Grid, List, Download, PartyPopper, Sparkles
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CATEGORY_COLORS } from "@/lib/constants";
import AppHeader from "@/components/AppHeader";
import html2pdf from "html2pdf.js";

// --- המאגר המלא של 101 הפרומפטים ---
const STATIC_DATA = [
  { id: 1, category: "דפי נחיתה", title: "כותרת ממירה לדף נחיתה", prompt: "כתוב 10 וריאציות כותרת ל[מוצר] עבור [קהל יעד] בטון [טון כתיבה]. בכל וריאציה: הבטחת תוצאה ברורה + סיבה להאמין + מילה רגשית אחת.", audience: "כללי", isSample: true, visible: true, order: 1 },
  { id: 2, category: "דפי נחיתה", title: "פתיח אמפתי קצר", prompt: "כתוב פתיח של 70–100 מילים שמזהה כאב אחד, תקווה אחת ופתרון אחד ל[קהל יעד]. סיים ב-CTA יחיד.", audience: "מטפלים", isSample: true, visible: true, order: 2 },
  { id: 3, category: "דפי נחיתה", title: "תועלות בשלוש רמות", prompt: "ערוך רשימת 6 תועלות ל[מוצר]: 2 רגשיות, 2 תפקודיות, 2 תוצאות מדידות עבור [קהל יעד].", audience: "עסקים קטנים", isSample: true, visible: true, order: 3 },
  { id: 4, category: "דפי נחיתה", title: "פירוק התנגדות עיקרית", prompt: "זהה את ההתנגדות הגדולה ל[מוצר] וכתוב מענה בשלושה חלקים: אמפתיה → הסבר → הוכחה, עם דוגמה ישראלית.", audience: "כללי", isSample: true, visible: true, order: 4 },
  { id: 5, category: "דפי נחיתה", title: "סיפורי מיקרו", prompt: "כתוב 3 עדויות קצרות (40–60 מילים) עם נתון לפני/אחרי אחד לכל עדות.", audience: "כללי", isSample: true, visible: true, order: 5 },
  { id: 6, category: "דפי נחיתה", title: "FAQ ממיר", prompt: "צור 6 שאלות ותשובות לדף הנחיתה עבור [מוצר], כשכל תשובה מסתיימת בהזמנה עדינה לפעולה.", audience: "כללי", isSample: true, visible: true, order: 6 },
  { id: 7, category: "דפי נחיתה", title: "הצעת ערך במשפט אחד", prompt: "נסח USP חד של עד 14 מילים: למי, מה, ולמה זה חשוב. ספק 5 וריאציות.", audience: "כללי", isSample: true, visible: true, order: 7 },
  { id: 8, category: "דפי נחיתה", title: "למי זה לא מתאים", prompt: "כתוב 4 נקודות שמסננות בעדינות לקוחות לא מתאימים ומחזקות אמון.", audience: "כללי", isSample: true, visible: true, order: 8 },
  { id: 9, category: "דפי נחיתה", title: "CTA ראשי ושני", prompt: "צור 2 קריאות לפעולה: ראשי ורך; שני משלים. הוסף מיקרו-קופי על אחריות/החזר.", audience: "כללי", isSample: true, visible: true, order: 9 },
  { id: 10, category: "דפי נחיתה", title: "תקציר לנייד", prompt: "כתוב דף נחיתה מקוצר לנייד: כותרת, 3 תועלות, עדות, מחיר, CTA – עד 180 מילים.", audience: "כללי", isSample: true, visible: true, order: 10 },
  { id: 11, category: "קמפיינים", title: "קמפיין 7 ימים להשקה רכה", prompt: "בנה רצף של 7 ימים: טיזר, סיפור לקוח, פירוק התנגדות, הצעה, בונוס, דחיפות, סיכום. לכל יום כותרת, מסר, CTA אחד.", audience: "עסקים קטנים", isSample: true, visible: true, order: 11 },
  { id: 12, category: "קמפיינים", title: "Retargeting השארת עגלה", prompt: "כתוב 3 מודעות רימרקטינג למבקרים שלא המירו: מסר רגשי, חברתי, רציונלי.", audience: "איקומרס", isSample: true, visible: true, order: 12 },
  { id: 13, category: "קמפיינים", title: "קמפיין עדות מובילה", prompt: "בחר עדות חזקה אחת ובנה סביבה 3 פוסטים שונים + מודעה אחת.", audience: "כללי", isSample: false, visible: true, order: 13 },
  { id: 14, category: "קמפיינים", title: "קמפיין מחיר עולה", prompt: "כתוב סדרה של 3 מסרים שמדגישה עליית מחיר עתידית בלי לחץ אגרסיבי; לכל מסר סיבה אמיתית.", audience: "כללי", isSample: false, visible: true, order: 14 },
  { id: 15, category: "קמפיינים", title: "שאלות מהקהל", prompt: "אסוף 5 שאלות נפוצות וכתוב 5 פוסטים שמתחילים בציטוט הלקוח.", audience: "כללי", isSample: false, visible: true, order: 15 },
  { id: 16, category: "קמפיינים", title: "תוצאה ב-24 שעות", prompt: "הבטח תוצאה קטנה ומהירה. בנה 2 אימיילים + מודעה אחת עם דד-ליין רך.", audience: "כללי", isSample: false, visible: true, order: 16 },
  { id: 17, category: "קמפיינים", title: "שדרוג ללקוחות קיימים", prompt: "כתוב 3 אימיילים ללקוחות קיימים: ערך נוסף + הצעת שדרוג עם בונוס מוקדם.", audience: "כללי", isSample: false, visible: true, order: 17 },
  { id: 18, category: "קמפיינים", title: "שגר ושכח רבעוני", prompt: "תכנן 12 פוסטים – 1 לשבוע – לפי 4 תמות חוזרות. הכן לוח שנה קצר.", audience: "כללי", isSample: false, visible: true, order: 18 },
  { id: 19, category: "קמפיינים", title: "קמפיין הדרכת לייב", prompt: "כתוב הזמנה ללייב, תזכורת, ופוסט סיכום עם CTA לרכישה/הצטרפות.", audience: "כללי", isSample: false, visible: true, order: 19 },
  { id: 20, category: "קמפיינים", title: "סגירת עגלות – 48 שעות", prompt: "כתוב 2 הודעות קצרות + פוסט שמחדד דד-ליין, ערך ובונוס נעלם.", audience: "כללי", isSample: false, visible: true, order: 20 },
  { id: 21, category: "אימיילים חכמים", title: "Onboarding בשלוש הודעות", prompt: "כתוב 3 אימיילים: ברוך הבא, איך מתחילים, שאלות נפוצות – עם קישורים מדידים.", audience: "כללי", isSample: false, visible: true, order: 21 },
  { id: 22, category: "אימיילים חכמים", title: "לפני שמוותרים", prompt: "כתוב מייל אמפתי למי שאמר/ה 'יקר מדי' + הצע חלופה (מסלול בסיס/תשלומים).", audience: "כללי", isSample: false, visible: true, order: 22 },
  { id: 23, category: "אימיילים חכמים", title: "ניוזלטר 3-חלקים", prompt: "כתוב טיפ קצר, סיפור לקוח, הזמנה עדינה. הוסף שורת נושא עד 45 תווים.", audience: "כללי", isSample: false, visible: true, order: 23 },
  { id: 24, category: "אימיילים חכמים", title: "הוכחה חברתית במייל", prompt: "הצג 2 תוצאות לקוחות + קישור לתיק עבודות + CTA יחיד.", audience: "כללי", isSample: false, visible: true, order: 24 },
  { id: 25, category: "אימיילים חכמים", title: "בונוס סודי ל-48 שעות", prompt: "כתוב מסר קצר עם בונוס זמני, דד-ליין ושאלות/תשובות בתחתית.", audience: "כללי", isSample: false, visible: true, order: 25 },
  { id: 26, category: "אימיילים חכמים", title: "שדרוג לאחר 14 יום", prompt: "שלח למי שהשתמש ב[מוצר] 14+ ימים – הצעת שדרוג עם הדגמת ערך ותמחור.", audience: "כללי", isSample: false, visible: true, order: 26 },
  { id: 27, category: "אימיילים חכמים", title: "הדרכה בחינם", prompt: "שלח לינק להדרכה קצרה + צ'קליסט מצורף להורדה.", audience: "כללי", isSample: false, visible: true, order: 27 },
  { id: 28, category: "אימיילים חכמים", title: "בקשת פידבק קצרה", prompt: "כתוב 3 שאלות סגורות ושאלה פתוחה אחת + הצע תשורה קטנה למשיבים.", audience: "כללי", isSample: false, visible: true, order: 28 },
  { id: 29, category: "אימיילים חכמים", title: "תזכורת רכה", prompt: "כתוב שתי שורות + לינק ישיר לרכישה + תאריך סגירה.", audience: "כללי", isSample: false, visible: true, order: 29 },
  { id: 30, category: "אימיילים חכמים", title: "חתימת אימייל ממירה", prompt: "כתוב 3 גרסאות חתימה עם משפט ערך וקישור יחיד לפעולה.", audience: "כללי", isSample: false, visible: true, order: 30 },
  { id: 31, category: "דפי מכירה", title: "AIDA מלאה", prompt: "כתוב דף מכירה לפי Attention-Interest-Desire-Action עבור [מוצר], 800–1200 מילים.", audience: "כללי", isSample: false, visible: true, order: 31 },
  { id: 32, category: "דפי מכירה", title: "טבלת השוואה הוגנת", prompt: "כתוב 5 שורות השוואה בין [מוצר] לחלופות, בלי זלזול; הדגש ייחוד אמיתי.", audience: "כללי", isSample: false, visible: true, order: 32 },
  { id: 33, category: "דפי מכירה", title: "פירוק 3 התנגדויות קשות", prompt: "טפל במחיר, זמן ואמון – פתרון ודוגמה לכל התנגדות.", audience: "כללי", isSample: false, visible: true, order: 33 },
  { id: 34, category: "דפי מכירה", title: "הוכחה מספרית", prompt: "כתוב קטע עם 3 נתונים מדידים לפני/אחרי; ציין מקור או עדות.", audience: "כללי", isSample: false, visible: true, order: 34 },
  { id: 35, category: "דפי מכירה", title: "סיפור מקרה", prompt: "כתוב Case Study: רקע, תהליך, תוצאה, ציטוט לקוח.", audience: "כללי", isSample: false, visible: true, order: 35 },
  { id: 36, category: "דפי מכירה", title: "אחריות והחזר הוגנים", prompt: "נסח נוסח קצר וברור: מה נחשב שימוש הוגן, מתי מגיע החזר וכיצד לבקשו.", audience: "כללי", isSample: false, visible: true, order: 36 },
  { id: 37, category: "דפי מכירה", title: "מה בפנים", prompt: "מנה מודולים/בונוסים של [מוצר] והוסף תועלת אחת ברורה לכל רכיב.", audience: "כללי", isSample: false, visible: true, order: 37 },
  { id: 38, category: "דפי מכירה", title: "CTA בשלושה מקומות", prompt: "כתוב 3 CTA מותאמים: עליון, אמצע, תחתית, עם טון לא דוחף.", audience: "כללי", isSample: false, visible: true, order: 38 },
  { id: 39, category: "דפי מכירה", title: "מקטע 'מי אני' אמין", prompt: "כתוב סיפור אישי קצר שמחבר ערכים לתועלת לקוח, בלי התרברבות.", audience: "כללי", isSample: false, visible: true, order: 39 },
  { id: 40, category: "דפי מכירה", title: "Mini-FAQ ממוקד רכישה", prompt: "כתוב 5 תשובות קצרות על תשלום, גישה, תמיכה, פרטיות וקבלות.", audience: "כללי", isSample: false, visible: true, order: 40 },
  { id: 41, category: "מודעות", title: "מודעת חיפוש – טקסט קצר", prompt: "כתוב 5 כותרות + 4 תיאורי מודעה ל[מוצר] עם מילות מפתח של [קהל יעד].", audience: "כללי", isSample: false, visible: true, order: 41 },
  { id: 42, category: "מודעות", title: "מודעת תדמית לרחב", prompt: "כתוב 3 וריאציות של מסר-חזון-CTA לפיד רחב; שמור שפה פשוטה וצלולה.", audience: "כללי", isSample: false, visible: true, order: 42 },
  { id: 43, category: "מודעות", title: "מודעת כאב-פתרון", prompt: "כתוב שתי שורות כאב + שורת פתרון אחת, עם קריאה לפעולה קצרה.", audience: "כללי", isSample: false, visible: true, order: 43 },
  { id: 44, category: "מודעות", title: "מודעת עדות", prompt: "שלב ציטוט לקוח של שורה אחת + הבטחת תוצאה זהירה ואמינה.", audience: "כללי", isSample: false, visible: true, order: 44 },
  { id: 45, category: "מודעות", title: "מודעת סקר", prompt: "כתוב שאלה אחת עם 3 תשובות אפשריות – והצג מסך תודה עם הצעה רלוונטית.", audience: "כללי", isSample: false, visible: true, order: 45 },
  { id: 46, category: "מודעות", title: "מודעת לפני-אחרי", prompt: "כתוב תיאור שורה-אחת לפני, שורה-אחת אחרי, ו-CTA קצר עם לינק.", audience: "כללי", isSample: false, visible: true, order: 46 },
  { id: 47, category: "מודעות", title: "דחיפות הוגנת", prompt: "כתוב מודעה עם דד-ליין אמיתי והנמקה אמינה (בונוס זמני/מלאי מוגבל).", audience: "כללי", isSample: false, visible: true, order: 47 },
  { id: 48, category: "מודעות", title: "רימרקטינג – 3 מסרים", prompt: "כתוב 3 מסרים שונים למבקרים שלא המירו: ערך, חברתיות, מחיר.", audience: "כללי", isSample: false, visible: true, order: 48 },
  { id: 49, category: "מודעות", title: "מודעת וידאו קצרה", prompt: "כתוב תסריט 15 שניות: פתיח-בעיה-פתרון-CTA, עם טיימקוד משוער.", audience: "כללי", isSample: false, visible: true, order: 49 },
  { id: 50, category: "מודעות", title: "קרוסלת 5 שקופיות", prompt: "כתוב טקסט ל-5 שקופיות: בעיה, פתרון, תועלת 1, תועלת 2, CTA.", audience: "כללי", isSample: false, visible: true, order: 50 },
  { id: 51, category: "תרשימי חשיבה", title: "מפת תוכן רבעונית", prompt: "בנה Mind-Map ל-12 פוסטים (3 עמודי תוכן × 4 שבועות) עם רעיון קצר לכל פוסט.", audience: "כללי", isSample: false, visible: true, order: 51 },
  { id: 52, category: "תרשימי חשיבה", title: "מפת מוצר", prompt: "פרק את [מוצר] למודולים; הוסף תועלת אחת ברורה לכל מודול ומטרת-על אחת.", audience: "כללי", isSample: false, visible: true, order: 52 },
  { id: 53, category: "תרשימי חשיבה", title: "מפת קהל יעד", prompt: "פלח את [קהל יעד] ל-5 תתי-קהלים: צורך, התנגדות, ערוץ מועדף, מסר מרכזי.", audience: "כללי", isSample: false, visible: true, order: 53 },
  { id: 54, category: "תרשימי חשיבה", title: "מפת התנגדויות", prompt: "רכז 8 התנגדויות מרכזיות וכתוב מענה של שורה אחת לכל התנגדות.", audience: "כללי", isSample: false, visible: true, order: 54 },
  { id: 55, category: "תרשימי חשיבה", title: "מפת השקה", prompt: "צייר ציר זמן לפני→אחרי; הוסף פעולות לכל ערוץ תוכן (מייל, רשתות, מודעות).", audience: "כללי", isSample: false, visible: true, order: 55 },
  { id: 56, category: "תרשימי חשיבה", title: "מפת מסרים רגשיים", prompt: "בחר 6 רגשות מרכזיים וכתוב מסר קצר לכל רגש ביחס ל[מוצר] ו[קהל יעד].", audience: "כללי", isSample: false, visible: true, order: 56 },
  { id: 57, category: "תרשימי חשיבה", title: "מפת עדויות", prompt: "הגדר מה לבקש מכל לקוח כדי לקבל עדות חזקה: נתון, הקשר, ציטוט קצר.", audience: "כללי", isSample: false, visible: true, order: 57 },
  { id: 58, category: "תרשימי חשיבה", title: "מפת Upsell/Cross-sell", prompt: "תכנן 3 מסלולי המשך אחרי רכישה – למתחילים, ביניים, מתקדמים – עם הצעה לכל מסלול.", audience: "כללי", isSample: false, visible: true, order: 58 },
  { id: 59, category: "תרשימי חשיבה", title: "מפת משפך פשוט", prompt: "מפה את המסרים לאורך המשפך: מודעה → דף נחיתה → אימייל → מכירה.", audience: "כללי", isSample: false, visible: true, order: 59 },
  { id: 60, category: "תרשימי חשיבה", title: "מפת תוכן לבלוג", prompt: "נסח 10 כותרות לבלוג, מסודרות לפי 3 קטגוריות נושא, עם תכלית לכל פוסט.", audience: "כללי", isSample: false, visible: true, order: 60 },
  { id: 61, category: "טיקטוק-רילס-שורטס", title: "5 פתיחים שמחזיקים צפייה", prompt: "כתוב 5 הוקים בני 5–7 מילים לסרטונים על [נושא] לקהל [קהל יעד].", audience: "יוצרי תוכן", isSample: false, visible: true, order: 61 },
  { id: 62, category: "טיקטוק-רילס-שורטס", title: "תסריט 30 שניות", prompt: "כתוב תסריט 30 שניות: פתיח-בעיה-פתרון-CTA, עם טיימקוד בסיסי לכל קטע.", audience: "יוצרי תוכן", isSample: false, visible: true, order: 62 },
  { id: 63, category: "טיקטוק-רילס-שורטס", title: "טרנדים מותאמי נישה", prompt: "מנה 5 טרנדים שניתן להתאים ל[תחום] והצע רעיון קצר לכל אחד.", audience: "יוצרי תוכן", isSample: false, visible: true, order: 63 },
  { id: 64, category: "טיקטוק-רילס-שורטס", title: "שובר התנגדות", prompt: "כתוב וידאו 20–30 שניות שמפרק התנגדות אחת עם דוגמה אחת.", audience: "כללי", isSample: false, visible: true, order: 64 },
  { id: 65, category: "טיקטוק-רילס-שורטס", title: "לפני-אחרי", prompt: "בנה מסגרת צילום: לפני/אחרי עם טקסט מסך לכל שלב, ו-CTA קצר בסוף.", audience: "כללי", isSample: false, visible: true, order: 65 },
  { id: 66, category: "טיקטוק-רילס-שורטס", title: "מאחורי הקלעים", prompt: "הצע 3 רעיונות אותנטיים שמגבירים אמון במותג האישי תוך שמירה על טבעיות.", audience: "כללי", isSample: false, visible: true, order: 66 },
  { id: 67, category: "טיקטוק-רילס-שורטס", title: "טמפלט כתוביות", prompt: "כתוב טקסט עד 8 מילים לשקופית × 5 שקופיות; ודא נראות במובייל.", audience: "כללי", isSample: false, visible: true, order: 67 },
  { id: 68, category: "טיקטוק-רילס-שורטס", title: "CTA לא-מכירתית", prompt: "נסח 4 קריאות רכות שמזמינות לשמור/לשתף/להגיב במקום לקנות.", audience: "כללי", isSample: false, visible: true, order: 68 },
  { id: 69, category: "טיקטוק-רילס-שורטס", title: "סקר קצר בסרטון", prompt: "כתוב שאלה אחת עם 3 תשובות על המסך + CTA להמשך אינטראקציה.", audience: "כללי", isSample: false, visible: true, order: 69 },
  { id: 70, category: "טיקטוק-רילס-שורטס", title: "תזמון פרסום", prompt: "הצע 3 זמנים טובים בשבוע לפי [קהל יעד] והרגלי גלישה, עם נימוק קצר.", audience: "כללי", isSample: false, visible: true, order: 70 },
  { id: 71, category: "אינסטגרם", title: "קרוסלת ערך – 7 שקופיות", prompt: "כתוב טקסט ל-7 שקופיות: בעיה→ערך→ערך→ערך→עדות→הצעה→CTA; שמור פשטות ובהירות.", audience: "כללי", isSample: false, visible: true, order: 71 },
  { id: 72, category: "אינסטגרם", title: "פוסט 'מכתב פתוח'", prompt: "כתוב 120–160 מילים בגוף ראשון – אמפתי וישיר, עם הזמנה לשתף תובנה שלקחו.", audience: "כללי", isSample: false, visible: true, order: 72 },
  { id: 73, category: "אינסטגרם", title: "סטוריז 'שאלו אותי'", prompt: "תכנן 5 סטוריז עם סטיקר שאלות והבטחה לענות בכנות, ו-CTA להמשך מעורבות.", audience: "כללי", isSample: false, visible: true, order: 73 },
  { id: 74, category: "אינסטגרם", title: "Reels מינימלי", prompt: "כתוב תסריט 20 שניות + כתוביות קצרות; שמור קצב קליט ולהוק חזק ב-3 שניות ראשונות.", audience: "כללי", isSample: false, visible: true, order: 74 },
  { id: 75, category: "אינסטגרם", title: "פוסט עדות אמיתי", prompt: "שלב ציטוט לקוח + תמונת לפני/אחרי; הימנע מליטוש יתר, שמור אמינות.", audience: "כללי", isSample: false, visible: true, order: 75 },
  { id: 76, category: "אינסטגרם", title: "לינק-אין-ביו מסודר", prompt: "כתוב טקסטים קצרים ל-3 קישורים עיקריים: חוברת, דף נחיתה, יצירת קשר.", audience: "כללי", isSample: false, visible: true, order: 76 },
  { id: 77, category: "אינסטגרם", title: "תיאור פרופיל ממיר", prompt: "כתוב 3 גרסאות ב-150 תווים עם הצעת ערך ו-CTA עדין, כולל אימוג'י אחד.", audience: "כללי", isSample: false, visible: true, order: 77 },
  { id: 78, category: "אינסטגרם", title: "10 האשטגים חכמים", prompt: "בחר 10 האשטגים: נישה, קהל, מיקוד, ישראל; שלב בין נפוצים לנישתיים.", audience: "כללי", isSample: false, visible: true, order: 78 },
  { id: 79, category: "אינסטגרם", title: "סדרת 5 פוסטים שבועית", prompt: "בנה תכנית ל-4 שבועות × 5 פוסטים = 20 פוסטים מסודרים מראש.", audience: "כללי", isSample: false, visible: true, order: 79 },
  { id: 80, category: "אינסטגרם", title: "הודעת DM רכה", prompt: "כתוב תבנית תשובה מנומסת לשאלה על מחיר/זמינות + הצעה לשיחה קצרה.", audience: "כללי", isSample: false, visible: true, order: 80 },
  { id: 81, category: "לינקדאין", title: "פוסט תובנה מקצועית", prompt: "כתוב 120–180 מילים: סיפורון → תובנה → שאלה לקהל; שמור שפה עניינית אך אנושית.", audience: "בעלי עסקים", isSample: false, visible: true, order: 81 },
  { id: 82, category: "לינקדאין", title: "מאמר קצר", prompt: "כתוב 400–600 מילים: כך פתרנו [בעיה] אצל [קהל יעד] עם [שיטה/מוצר] – מבנה ברור.", audience: "יועצים", isSample: false, visible: true, order: 82 },
  { id: 83, category: "לינקדאין", title: "פוסט נתון ומסקנה", prompt: "פתח בנתון מפתיע, פרש השלכה, וסיים בהזמנה לשיחה או לשיתוף ניסיון.", audience: "בעלי עסקים", isSample: false, visible: true, order: 83 },
  { id: 84, category: "לינקדאין", title: "שדרוג כותרת ו-About", prompt: "כתוב 3 גרסאות לכותרת פרופיל ו-About שמציגים הצעת ערך ברורה וממוקדת.", audience: "בעלי עסקים", isSample: false, visible: true, order: 84 },
  { id: 85, category: "לינקדאין", title: "הודעת קונקשן לא דוחפת", prompt: "כתוב 3 תבניות של 2–3 משפטים ליצירת קשר לא מכירתי, עם הצעה עדינה לערך.", audience: "בעלי עסקים", isSample: false, visible: true, order: 85 },
  { id: 86, category: "לינקדאין", title: "פוסט גיוס לקוח אידיאלי", prompt: "תאר פרויקט חלומי ומי מתאים; חבר הזמנה פרטית ל-DM ללא לחץ.", audience: "יועצים", isSample: false, visible: true, order: 86 },
  { id: 87, category: "לינקדאין", title: "נראות מומחית", prompt: "מנה 6 רעיונות לפוסטים שמבססים סמכות: מפת חשיבה, דוגמה, תובנה, נתון, שאלה, טעות נפוצה.", audience: "בעלי עסקים", isSample: false, visible: true, order: 87 },
  { id: 88, category: "לינקדאין", title: "סיקור כנס/לייב", prompt: "כתוב 5 מסקנות עיקריות + הזמנה לקריאה או לרכישה קשורה, בלי למכור אגרסיבי.", audience: "יועצים", isSample: false, visible: true, order: 88 },
  { id: 89, category: "לינקדאין", title: "Case Study קצר", prompt: "כתוב לפני → תהליך → אחרי ב-180–220 מילים, עם CTA רך להמשך דיון.", audience: "בעלי עסקים", isSample: false, visible: true, order: 89 },
  { id: 90, category: "לינקדאין", title: "CTA ללינקדאין", prompt: "נסח 4 קריאות לפעולה לא-מכירתיות: לשמור, להגיב, לשתף, לשאול.", audience: "בעלי עסקים", isSample: false, visible: true, order: 90 },
  { id: 91, category: "שירותים מגוונים", title: "פרופיל עסק מהלב", prompt: "כתוב תיאור עסק של 120 מילים: מה אתה עושה, למי, ולמה זה חשוב – בשפה אנושית.", audience: "כללי", isSample: false, visible: true, order: 91 },
  { id: 92, category: "שירותים מגוונים", title: "דף 'צרו קשר' שממיר", prompt: "הצע 5 שדות בלבד + משפט אמון קצר; הימנע מטקסט עודף ומסיחים.", audience: "כללי", isSample: false, visible: true, order: 92 },
  { id: 93, category: "שירותים מגוונים", title: "סקר לקוחות מינימליסטי", prompt: "כתוב 6 שאלות חיוניות להבנת צורך והצלבה עם הצעה קיימת.", audience: "כללי", isSample: false, visible: true, order: 93 },
  { id: 94, category: "שירותים מגוונים", title: "הצעת מחיר בהירה", prompt: "נסח מייל הצעת מחיר: פתיח, פירוט, תנאים, מחיר, ושורת סגירה אנושית.", audience: "כללי", isSample: false, visible: true, order: 94 },
  { id: 95, category: "שירותים מגוונים", title: "דף תודה אפקטיבי", prompt: "כתוב טקסט תודה קצר + שני צעדים הבאים ברורים; הוסף CTA עדין.", audience: "כללי", isSample: false, visible: true, order: 95 },
  { id: 96, category: "שירותים מגוונים", title: "צ'קליסט 'לפני פרסום'", prompt: "ערוך 10 בדיקות תוכן מהירות לפני עלייה לאוויר: כותרת, CTA, לינק, הוכחה, SEO בסיסי וכו'.", audience: "כללי", isSample: false, visible: true, order: 96 },
  { id: 97, category: "שירותים מגוונים", title: "מפת יח\"צ בסיסית", prompt: "זהה 10 שיתופי פעולה פוטנציאליים והצע דרך פנייה קצרה לכל אחד.", audience: "כללי", isSample: false, visible: true, order: 97 },
  { id: 98, category: "שירותים מגוונים", title: "תסריט שיחת מכירה רכה", prompt: "כתוב תסריט: פתיחה → בירור → התאמה → הצעה → סגירה עדינה; שמור אותנטיות.", audience: "כללי", isSample: false, visible: true, order: 98 },
  { id: 99, category: "שירותים מגוונים", title: "עמוד 'עליי' אמיתי", prompt: "כתוב סיפור אישי קצר שמחבר ערכים לתועלת לקוח, בלי 'אני-אני'.", audience: "כללי", isSample: false, visible: true, order: 99 },
  { id: 100, category: "שירותים מגוונים", title: "לוח זמנים להשקה", prompt: "בנה ציר 14 יום עם פעולות יומיות קצרות לכל ערוץ: תוכן, מייל, מודעות, שיתופים.", audience: "כללי", isSample: false, visible: true, order: 100 },
  { id: 101, category: "Reverse Prompting-שכתוב", title: "שכתוב תוצר AI לרמה אנושית", prompt: "הדבק טקסט קיים ובקש: 'שכתב בטון [טון], קצר ב-20%, שמור מבנה, הסר ז'רגון, הוסף נגיעת רגש, RTL תקין.'", audience: "כללי", isSample: false, visible: true, order: 101 }
];

interface ExternalPrompt {
  id: string | number;
  category: string;
  title: string;
  prompt: string;
  audience: string;
  isSample: boolean;
  visible: boolean;
  order: number;
}

const ITEMS_PER_PAGE = 200;

const Full = () => {
  // --- דיאלוג ברוכים הבאים ---
  const [showWelcome, setShowWelcome] = useState(false);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [prompts, setPrompts] = useState<ExternalPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAudience, setSelectedAudience] = useState<string>("הכל");
  const [selectedCategory, setSelectedCategory] = useState<string>("הכל");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const [categories, setCategories] = useState<string[]>([]);
  const [audiences, setAudiences] = useState<string[]>([]);

  useEffect(() => {
    setPrompts(STATIC_DATA);
    const uniqueCategories = [...new Set(STATIC_DATA.map(p => p.category).filter(Boolean))];
    setCategories(uniqueCategories.sort());
    const uniqueAudiences = [...new Set(STATIC_DATA.map(p => p.audience).filter(Boolean))];
    setAudiences(uniqueAudiences.sort());
    setLoading(false);
    
    const savedFavorites = localStorage.getItem("pb_favorites");
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    const savedTheme = localStorage.getItem("prompts-theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    // --- בדיקה האם זו כניסה ראשונה ---
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  // סגירת חלון ברוכים הבאים ושמירה בזיכרון
  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("prompts-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("prompts-theme", "light");
    }
  };

  const copyToClipboard = (prompt: ExternalPrompt) => {
    navigator.clipboard.writeText(prompt.prompt);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "הועתק!", description: "הפרומפט הועתק ללוח" });
  };

  const toggleFavorite = (id: string | number) => {
    const idStr = String(id);
    const newFavorites = favorites.includes(idStr)
      ? favorites.filter(fav => fav !== idStr)
      : [...favorites, idStr];
    setFavorites(newFavorites);
    localStorage.setItem("pb_favorites", JSON.stringify(newFavorites));
  };

  const exportToPDF = () => {
    toast({ title: "מכין את הקובץ...", description: "ההורדה תתחיל מיד." });
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="direction: rtl; font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="text-align: center; color: #6b21a8; margin-bottom: 30px;">PromptBook - החוברת המלאה</h1>
        ${filteredPrompts.map(p => `
          <div style="margin-bottom: 20px; border: 1px solid #eee; padding: 15px; border-radius: 8px; page-break-inside: avoid;">
            <h3 style="color: #333; margin: 0 0 10px 0;">${p.order}. ${p.title}</h3>
            <div style="margin-bottom: 10px;">
              <span style="background: #eee; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${p.category}</span>
              <span style="background: #eee; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${p.audience}</span>
            </div>
            <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${p.prompt}</p>
          </div>
        `).join('')}
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #999;">© PromptBook 2025 | פנינה קריוף</div>
      </div>
    `;
    const opt = {
      margin: 10,
      filename: 'PromptBook-Full.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const filteredPrompts = useMemo(() => {
    let filtered = prompts;
    if (showFavoritesOnly) filtered = filtered.filter(p => favorites.includes(String(p.id)));
    
    return filtered.filter(p => 
      (selectedAudience === "הכל" || p.audience === selectedAudience) &&
      (selectedCategory === "הכל" || p.category === selectedCategory) &&
      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.prompt.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [prompts, showFavoritesOnly, selectedAudience, searchQuery, favorites, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      {/* --- חלון ברוכים הבאים --- */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="sm:max-w-md text-center" dir="rtl">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <PartyPopper className="h-6 w-6 text-purple-600" />
            </div>
            <DialogTitle className="text-2xl text-center">ברוכים הבאים ל-PromptBook! 🥂</DialogTitle>
            <DialogDescription className="text-center pt-2 text-lg">
              איזה כיף שהצטרפתם! הנה איך להפיק את המקסימום מהכלי:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 text-right">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Search className="text-purple-500" />
              <span><strong>1. סננו וחפשו:</strong> מצאו בדיוק מה שאתם צריכים לפי קטגוריה או קהל יעד.</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Copy className="text-blue-500" />
              <span><strong>2. העתיקו בקליק:</strong> כפתור "העתק" שומר את הפרומפט ללוח מיד.</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Heart className="text-red-500" />
              <span><strong>3. שמרו מועדפים:</strong> בנו את רשימת הפרומפטים המנצחת שלכם.</span>
            </div>
          </div>

          <DialogFooter className="sm:justify-center">
            <Button onClick={handleCloseWelcome} className="w-full gradient-primary text-white font-bold text-lg py-6">
              קדימה, בואו נתחיל ליצור! 🚀
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
           <div className="relative w-full md:w-1/3">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              placeholder="חיפוש פרומפטים..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="pr-10 text-right bg-white" 
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto justify-end flex-wrap">
             <Button onClick={exportToPDF} className="bg-black hover:bg-gray-800 text-white text-sm flex items-center gap-2">
               <Download className="h-4 w-4" /> הורד PDF
             </Button>

             <div className="bg-white border rounded-md p-1 flex items-center">
                <Button variant="ghost" size="sm" className={viewMode === 'grid' ? 'bg-purple-100 text-purple-700' : 'text-gray-500'} onClick={() => setViewMode('grid')}><Grid className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className={viewMode === 'list' ? 'bg-purple-100 text-purple-700' : 'text-gray-500'} onClick={() => setViewMode('list')}><List className="h-4 w-4" /></Button>
             </div>

             <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[140px] bg-white"><SelectValue placeholder="כל הקטגוריות" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="הכל">כל הקטגוריות</SelectItem>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>

             <Select value={selectedAudience} onValueChange={setSelectedAudience}>
                <SelectTrigger className="w-[140px] bg-white"><SelectValue placeholder="כל הקהלים" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="הכל">כל הקהלים</SelectItem>
                  {audiences.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
              
              <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setSelectedCategory('הכל'); setSelectedAudience('הכל'); }} className="text-blue-600">אפס</Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-purple-600">טוען...</div>
        ) : filteredPrompts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">לא נמצאו תוצאות.</div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt) => (
              <Card key={prompt.id} className="p-6 shadow-sm hover:shadow-md transition-all flex flex-col bg-white">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col gap-1">
                    <Badge style={{ backgroundColor: CATEGORY_COLORS[prompt.category] || "#666", color: "#fff", width: "fit-content" }}>
                      {prompt.category}
                    </Badge>
                    <span className="text-xs text-gray-500">{prompt.audience}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => toggleFavorite(prompt.id)}>
                    <Heart className={`h-4 w-4 ${favorites.includes(String(prompt.id)) ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">{prompt.title}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow whitespace-pre-line leading-relaxed">
                  {prompt.prompt}
                </p>
                <Button onClick={() => copyToClipboard(prompt)} className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-none">
                  <Copy className="h-4 w-4 ml-2" /> העתק
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <table className="w-full text-right">
              <thead className="bg-gray-50 text-gray-600 text-sm font-medium border-b border-gray-200">
                <tr>
                  <th className="p-4 font-bold">כותרת</th>
                  <th className="p-4 font-bold">קטגוריה</th>
                  <th className="p-4 font-bold">קהל יעד</th>
                  <th className="p-4 font-bold w-1/2">פרומפט</th>
                  <th className="p-4 text-center font-bold">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPrompts.map((prompt) => (
                  <tr key={prompt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{prompt.title}</td>
                    <td className="p-4">
                      <Badge variant="outline" className="font-normal bg-white">
                        {prompt.category}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-gray-500">{prompt.audience}</td>
                    <td className="p-4 text-sm text-gray-600 leading-relaxed">{prompt.prompt}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button size="sm" onClick={() => copyToClipboard(prompt)} className="bg-purple-600 text-white h-8 px-3">
                          <Copy className="h-3 w-3 ml-1" /> העתק
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => toggleFavorite(prompt.id)} className="h-8 w-8 p-0">
                          <Heart className={`h-4 w-4 ${favorites.includes(String(prompt.id)) ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Full;