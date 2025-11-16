import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Heart, Search, Download, Moon, Sun, Filter, X } from "lucide-react";
import html2pdf from "html2pdf.js";

type Prompt = {
  id: string;
  title: string;
  content: string;
  category: string;
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast(); // Load prompts from Supabase

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        console.log("Fetching prompts..."); // debug

        const { data, error } = await supabase.from("prompts").select("*").order("created_at", { ascending: false });

        console.log("Fetched data:", data); // debug
        console.log("Fetch error:", error); // debug

        if (error) throw error;

        if (!data || data.length === 0) {
          console.warn("No prompts found!");
          setPrompts([]);
          setCategories([]);
          setLoading(false);
          return;
        }

        const formattedPrompts = data.map((p) => ({
          id: p.id,
          title: p.title || "ללא כותרת",
          content: p.prompt || p.content || "ללא תוכן",
          category: p.category || "כללי",
        }));

        setPrompts(formattedPrompts);

        const uniqueCategories = [...new Set(data.map((p) => p.category).filter(Boolean))];
        setCategories(uniqueCategories);

        console.log("Loaded", formattedPrompts.length, "prompts"); // debug
      } catch (error) {
        console.error("Error fetching prompts:", error);
        toast({
          title: "שגיאה בטעינת הפרומפטים",
          description: error.message || "אנא נסי לרענן את הדף",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [toast]); // Load favorites, theme, and PayPal SDK

  useEffect(() => {
    const savedFavorites = localStorage.getItem("promptbook-favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const savedTheme = localStorage.getItem("promptbook-theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } // Preload Hebrew font for PDF generation

    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // --- START PayPal SDK Loading ---
    const paypalScript = document.createElement("script");
    paypalScript.src =
      "https://www.paypal.com/sdk/js?client-id=BAA9pb84hA96YyS3MdA-7E4ocZULj8P9L0FNewFBJZ8fMY-Z7Sl17R6RwOGIN2vPVLCgVNKiohWbCbg2Jw&components=hosted-buttons&disable-funding=venmo&currency=ILS";
    paypalScript.onload = () => {
      // Load the hosted button after SDK is ready
      const paypalButtonScript = document.createElement("script");
      paypalButtonScript.innerHTML = `
            paypal.HostedButtons({
                hostedButtonId: "TWSW6SFMDNR72",
            }).render("#paypal-container-TWSW6SFMDNR72")
        `;
      document.body.appendChild(paypalButtonScript);
    };
    document.body.appendChild(paypalScript);
    // --- END PayPal SDK Loading ---
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("promptbook-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("promptbook-theme", "light");
    }
  };

  const filteredPrompts = useMemo(() => {
    let filtered = prompts;

    if (showFavoritesOnly) {
      filtered = filtered.filter((p) => favorites.includes(p.id));
    }

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.content.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory, favorites, showFavoritesOnly, prompts]);

  const copyToClipboard = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "הועתק ללוח!",
      description: `הפרומפט "${title}" הועתק בהצלחה`,
    });
  };

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id) ? favorites.filter((fav) => fav !== id) : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem("promptbook-favorites", JSON.stringify(newFavorites));
    toast({
      title: favorites.includes(id) ? "הוסר מהמועדפים" : "נוסף למועדפים",
      description: favorites.includes(id) ? "הפרומפט הוסר מרשימת המועדפים שלך" : "הפרומפט נוסף לרשימת המועדפים שלך",
    });
  };

  const exportToPDF = async () => {
    const promptsToExport = showFavoritesOnly ? prompts.filter((p) => favorites.includes(p.id)) : filteredPrompts; // Create HTML content with Hebrew support and RTL using PromptBook design system

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wght@400;700&display=swap" rel="stylesheet">
        <style>
          * {
            direction: rtl;
            unicode-bidi: bidi-override;
          }
          body {
            font-family: 'Noto Sans Hebrew', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            padding: 40px;
            direction: rtl;
            text-align: right;
            background: hsl(210 40% 98%);
            color: hsl(222 47% 11%);
          }
          h1 {
            font-size: 32px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(135deg, hsl(217 91% 60%), hsl(200 95% 65%));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .prompt-item {
            margin-bottom: 25px;
            page-break-inside: avoid;
            border: 2px solid hsl(214 32% 91%);
            border-radius: 12px;
            padding: 20px;
            background: hsl(0 0% 100%);
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          }
          .prompt-title {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 10px;
            color: hsl(217 91% 60%);
          }
          .prompt-meta {
            display: inline-block;
            font-size: 12px;
            background: hsl(142 76% 36%);
            color: hsl(0 0% 100%);
            padding: 4px 12px;
            border-radius: 16px;
            margin-bottom: 12px;
            font-weight: 600;
          }
          .prompt-content {
            font-size: 14px;
            line-height: 1.8;
            color: hsl(222 47% 11%);
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .prompt-content p {
            margin-bottom: 12px;
          }
          
          @media print {
            body { 
              direction: rtl; 
              font-family: 'Noto Sans Hebrew', sans-serif; 
            }
            .prompt-item {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <h1>PromptBook - ספר הפרומפטים ✨</h1>
        ${promptsToExport
      .map(
        (prompt, index) => `
          <div class="prompt-item">
            <div class="prompt-title">${index + 1}. ${prompt.title}</div>
            <div class="prompt-meta">${prompt.category}</div>
            <div class="prompt-content">${prompt.content}</div>
          </div>
        `,
      )
      .join("")}
      </body>
      </html>
    `; // Render inside offscreen iframe to ensure proper layout and fonts

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-10000px";
    iframe.style.top = "0";
    iframe.width = "794"; // ~A4 width at 96 DPI
    iframe.height = "1123"; // ~A4 height at 96 DPI
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) throw new Error("Unable to access iframe document");
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close(); // Wait for iframe to finish loading

    await new Promise<void>((resolve) => {
      if (iframe.contentWindow?.document.readyState === "complete") resolve();
      else iframe.onload = () => resolve();
    }); // Ensure fonts in the iframe are ready (best-effort)

    try {
      await (iframeDoc as any).fonts?.ready;
    } catch {} // Small delay to ensure rendering is settled
    await new Promise((r) => setTimeout(r, 300)); // Configure html2pdf options

    const opt = {
      margin: [15, 15, 15, 15] as [number, number, number, number],
      filename: "promptbook-export.pdf",
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
      },
      jsPDF: {
        unit: "pt",
        format: "a4",
        orientation: "portrait" as const,
      },
    };

    try {
      await html2pdf().set(opt).from(iframeDoc.body).save();
      toast({
        title: "הקובץ הורד בהצלחה!",
        description: `ייצאת ${promptsToExport.length} פרומפטים ל-PDF`,
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "שגיאה בייצוא",
        description: "אירעה שגיאה בייצוא ה-PDF",
        variant: "destructive",
      });
    } finally {
      // Clean up
      iframe.remove();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
               {" "}
        <div className="text-center">
                   {" "}
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">טוען פרומפטים...</p>       {" "}
        </div>
             {" "}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
            {/* Header */}     {" "}
      <header className="border-b border-border bg-card shadow-card sticky top-0 z-50">
               {" "}
        <div className="container mx-auto px-4 py-4">
                   {" "}
          <div className="flex items-center justify-between">
                       {" "}
            <div className="flex items-center gap-3">
                           {" "}
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-lg">
                                P              {" "}
              </div>
                           {" "}
              <div>
                                <h1 className="text-2xl font-bold text-foreground">PromptBook</h1>               {" "}
                <p className="text-sm text-muted-foreground">ספר הפרומפטים האינטראקטיבי שלך</p>             {" "}
              </div>
                         {" "}
            </div>
                                    {" "}
            <div className="flex items-center gap-2">
                           {" "}
              <div id="paypal-container-TWSW6SFMDNR72" className="mr-4">
                                {/* PayPal button will render here */}             {" "}
              </div>
                           {" "}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={showFavoritesOnly ? "bg-accent" : ""}
              >
                               {" "}
                <Heart className={`h-5 w-5 ${showFavoritesOnly ? "fill-current text-destructive" : ""}`} />           
                 {" "}
              </Button>
                                          {" "}
              <Button variant="outline" size="icon" onClick={toggleTheme}>
                                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}             {" "}
              </Button>
                                          {" "}
              <Button onClick={exportToPDF} className="gradient-primary text-white">
                                <Download className="h-4 w-4 ml-2" />                ייצוא ל-PDF              {" "}
              </Button>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </header>
           {" "}
      <main className="container mx-auto px-4 py-8">
                {/* Search and Filter Section */}       {" "}
        <div className="mb-8 space-y-4">
                   {" "}
          <div className="relative">
                       {" "}
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />   
                   {" "}
            <Input
              type="text"
              placeholder="חיפוש פרומפטים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 text-right"
            />
                     {" "}
          </div>
                    {/* Categories */}         {" "}
          <div className="flex flex-wrap gap-2 items-center">
                        <Filter className="h-4 w-4 text-muted-foreground" />           {" "}
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
                            הכל            {" "}
            </Button>
                       {" "}
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                                {category}             {" "}
              </Button>
            ))}
                       {" "}
            {selectedCategory && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
                                <X className="h-4 w-4" />             {" "}
              </Button>
            )}
                     {" "}
          </div>
                 {" "}
        </div>
                {/* Stats */}       {" "}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                   {" "}
          <Card className="p-4 shadow-card">
                        <div className="text-sm text-muted-foreground">סך הכל פרומפטים</div>           {" "}
            <div className="text-3xl font-bold text-foreground mt-1">{prompts.length}</div>         {" "}
          </Card>
                              {" "}
          <Card className="p-4 shadow-card">
                        <div className="text-sm text-muted-foreground">פרומפטים מועדפים</div>           {" "}
            <div className="text-3xl font-bold text-destructive mt-1">{favorites.length}</div>         {" "}
          </Card>
                              {" "}
          <Card className="p-4 shadow-card">
                        <div className="text-sm text-muted-foreground">תוצאות חיפוש</div>           {" "}
            <div className="text-3xl font-bold text-primary mt-1">{filteredPrompts.length}</div>         {" "}
          </Card>
                 {" "}
        </div>
                {/* Prompts Grid */}       {" "}
        {filteredPrompts.length === 0 ? (
          <Card className="p-12 text-center shadow-card">
                        <p className="text-xl text-muted-foreground">לא נמצאו פרומפטים התואמים לחיפוש</p>         {" "}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {" "}
            {filteredPrompts.map((prompt) => (
              <Card
                key={prompt.id}
                className="p-6 shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col"
              >
                               {" "}
                <div className="flex items-start justify-between mb-3">
                                    <Badge variant="secondary">{prompt.category}</Badge>                 {" "}
                  <Button variant="ghost" size="icon" onClick={() => toggleFavorite(prompt.id)} className="h-8 w-8">
                                       {" "}
                    <Heart
                      className={`h-4 w-4 ${favorites.includes(prompt.id) ? "fill-current text-destructive" : ""}`}
                    />
                                     {" "}
                  </Button>
                                 {" "}
                </div>
                               {" "}
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                                    {prompt.title}               {" "}
                </h3>
                               {" "}
                <p className="text-sm text-muted-foreground mb-4 flex-grow leading-relaxed">
                                    {prompt.content}               {" "}
                </p>
                               {" "}
                <Button
                  onClick={() => copyToClipboard(prompt.content, prompt.title)}
                  className="w-full gradient-primary text-white"
                >
                                    <Copy className="h-4 w-4 ml-2" />                  העתק פרומפט                {" "}
                </Button>
                             {" "}
              </Card>
            ))}
                     {" "}
          </div>
        )}
             {" "}
      </main>
            {/* Footer */}     {" "}
      <footer className="border-t border-border mt-16 py-8 bg-card">
               {" "}
        <div className="container mx-auto px-4 text-center">
                   {" "}
          <p className="text-muted-foreground">
                        PromptBook - ספר הפרומפטים האינטראקטיבי | נבנה עם ❤️          {" "}
          </p>
                 {" "}
        </div>
             {" "}
      </footer>
         {" "}
    </div>
  );
};

export default Index;
