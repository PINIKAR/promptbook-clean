// App configuration constants

// Audience filter options - UPDATED
export const AUDIENCE_OPTIONS = [
  "הכל",
  "מנחים, מטפלים ומאמנים",
  "יועצים עסקיים",
  "פרילנסרים וסוכנויות שיווק",
  "יוצרי תוכן",
  "בעלי עסקים קטנים",
  "איקומרס",
  "כללי"
];

// Category colors mapping
export const CATEGORY_COLORS: Record<string, string> = {
  "דפי נחיתה": "#23b3b0",
  "קמפיינים": "#7a5cff",
  "אימיילים חכמים": "#f39c12",
  "דפי מכירה": "#e74c3c",
  "מודעות": "#27ae60",
  "תרשימי חשיבה": "#8e44ad",
  "טיקטוק-רילס-שורטס": "#2ecc71",
  "אינסטגרם": "#e84393",
  "לינקדאין": "#3498db",
  "שירותים מגוונים": "#95a5a6",
  "Reverse Prompting-שכתוב": "#34495e"
};

// Type definition for prompt from external JSON
export type ExternalPrompt = {
  id: string;
  category: string;
  title: string;
  prompt: string;
  audience: string;
  isSample: boolean;
  visible: boolean;
  order: number;
}; 
