import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Copy, 
  Search, 
  Heart, 
  Download, 
  Moon, 
  Sun,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Grid,
  List
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import html2pdf from "html2pdf.js";
import { AUDIENCE_OPTIONS, CATEGORY_COLORS, ExternalPrompt } from "@/lib/constants";

const ITEMS_PER_PAGE = 25;

const Full = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [prompts, setPrompts] = useState<ExternalPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAudience, setSelectedAudience] = useState<string>("הכל");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("הכל");

  useEffect(() => {
    // Check authentication and payment status with Supabase
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      
      // Check payment status
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('has_paid, subscription_expires')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      const hasPaid = subscription?.has_paid && 
                      (!subscription.subscription_expires || new Date(subscription.subscription_expires) > new Date());
      
      if (!hasPaid) {
        // Not paid - redirect to home (will show paywall)
        navigate("/");
        return;
      }
      
      setIsAuthenticated(true);
      fetchPrompts();
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    // Load saved preferences from localStorage
    const savedQuery = localStorage.getItem("pb_query");
    const savedAudience = localStorage.getItem("pb_audience");
    const savedFavorites = localStorage.getItem("pb_favorites");
    const savedNotes = localStorage.getItem("pb_notes");
    const savedTheme = localStorage.getItem("prompts-theme");

    if (savedQuery) setSearchQuery(savedQuery);
    if (savedAudience) setSelectedAudience(savedAudience);
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Save search and audience to localStorage
    localStorage.setItem("pb_query", searchQuery);
    localStorage.setItem("pb_audience", selectedAudience);
  }, [searchQuery, selectedAudience]);

  const fetchPrompts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('prompts')
        .select('id, category, title, prompt, audience, is_sample, visible, "order"')
        .eq('is_published', true)
        .eq('visible', true)
        .order('order', { ascending: true });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!data || data.length === 0) {
        throw new Error("לא נמצאו פרומפטים");
      }

      // Map is_sample to isSample for compatibility
      const mappedPrompts = data.map(p => ({
        id: p.id,
        category: p.category,
        title: p.title,
        prompt: p.prompt,
        audience: p.audience,
        isSample: p.is_sample,
        visible: p.visible,
        order: p.order
      }));

      setPrompts(mappedPrompts);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories.sort());
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בטעינת הפרומפטים");
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: err instanceof Error ? err.message : "שגיאה בטעינת הפרומפטים",
      });
    } finally {
      setLoading(false);
    }
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
    toast({
      title: "הועתק!",
      description: `הפרומפט "${prompt.title}" הועתק ללוח`,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    
    setFavorites(newFavorites);
    localStorage.setItem("pb_favorites", JSON.stringify(newFavorites));
    
    toast({
      title: favorites.includes(id) ? "הוסר מהמועדפים" : "נוסף למועדפים",
      description: favorites.includes(id) 
        ? "הפרומפט הוסר מרשימת המועדפים שלך"
        : "הפרומפט נוסף לרשימת המועדפים שלך",
    });
  };

  const updateNote = (id: string, note: string) => {
    const newNotes = { ...notes, [id]: note };
    setNotes(newNotes);
    localStorage.setItem("pb_notes", JSON.stringify(newNotes));
  };

  const exportToPDF = async () => {
    const promptsToExport = showFavoritesOnly 
      ? filteredPrompts.filter(p => favorites.includes(p.id))
      : filteredPrompts;

    // Create HTML content with Hebrew support and RTL
    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wght@400;700&display=swap" rel="stylesheet">
        <style>
          * {
            direction: rtl;
            unicode-bidi: plaintext;
          }
          body, #pdfContent {
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
            break-inside: avoid;
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
            font-size: 12px;
            background: hsl(142 76% 36%);
            color: hsl(0 0% 100%);
            padding: 4px 12px;
            border-radius: 16px;
            margin-bottom: 12px;
            font-weight: 600;
            display: inline-block;
          }
          .prompt-audience {
            font-size: 12px;
            background: hsl(217 91% 60%);
            color: hsl(0 0% 100%);
            padding: 4px 12px;
            border-radius: 16px;
            margin-bottom: 12px;
            margin-right: 8px;
            font-weight: 600;
            display: inline-block;
          }
          .prompt-content {
            font-size: 14px;
            line-height: 1.8;
            color: hsl(222 47% 11%);
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .page-break-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .page-break-before {
            page-break-before: always;
            break-before: page;
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
        <div id="pdfContent">
          <h1>101 פרומפטים - החוברת המלאה ✨</h1>
          ${promptsToExport.map((prompt, index) => `
            <div class="prompt-item page-break-avoid">
              <div class="prompt-title">${index + 1}. ${prompt.title}</div>
              <div>
                <span class="prompt-meta" style="background-color: ${CATEGORY_COLORS[prompt.category] || '#95a5a6'}">${prompt.category}</span>
                <span class="prompt-audience">${prompt.audience}</span>
              </div>
              <div class="prompt-content">${prompt.prompt}</div>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;

    // Render inside offscreen iframe to ensure proper layout and fonts
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-10000px';
    iframe.style.top = '0';
    iframe.width = '794';
    iframe.height = '1123';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      toast({
        title: "שגיאה",
        description: "לא ניתן ליצור את ה-PDF",
        variant: "destructive",
      });
      iframe.remove();
      return;
    }
    
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    await new Promise<void>((resolve) => {
      if (iframe.contentWindow?.document.readyState === 'complete') resolve();
      else iframe.onload = () => resolve();
    });

    // Wait for fonts to load before rendering PDF
    try {
      await document.fonts.ready;
      if (iframeDoc.fonts) {
        await iframeDoc.fonts.ready;
      }
    } catch (e) {
      console.warn('Font loading check failed:', e);
    }
    await new Promise((r) => setTimeout(r, 500));

    // Configure html2pdf options
    const opt = {
      margin: [16, 16, 16, 16] as [number, number, number, number],
      filename: 'promptbook.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        windowWidth: 1200
      },
      jsPDF: { 
        unit: 'pt', 
        format: 'a4', 
        orientation: 'portrait' as const
      }
    };

    try {
      const element = iframeDoc.getElementById('pdfContent');
      if (element) {
        await html2pdf().set(opt).from(element).save();
        toast({
          title: "הקובץ הורד בהצלחה!",
          description: `ייצאת ${promptsToExport.length} פרומפטים ל-PDF`,
        });
      }
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "שגיאה בייצוא",
        description: "אירעה שגיאה בייצוא ה-PDF",
        variant: "destructive",
      });
    } finally {
      iframe.remove();
    }
  };

  // Filter prompts: only visible=true, sorted by order
  const filteredPrompts = useMemo(() => {
    let filtered = prompts.filter(p => p.visible);

    if (showFavoritesOnly) {
      filtered = filtered.filter(p => favorites.includes(p.id));
    }

    const matchesSearch = (p: ExternalPrompt) =>
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAudience = (p: ExternalPrompt) =>
      selectedAudience === "הכל" || p.audience === selectedAudience;
    
    const matchesCategory = (p: ExternalPrompt) =>
      selectedCategory === "הכל" || p.category === selectedCategory;

    filtered = filtered.filter(p => matchesSearch(p) && matchesAudience(p) && matchesCategory(p));
    
    return filtered.sort((a, b) => a.order - b.order);
  }, [prompts, showFavoritesOnly, selectedAudience, searchQuery, favorites, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredPrompts.length / ITEMS_PER_PAGE);
  const paginatedPrompts = filteredPrompts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [searchQuery, selectedAudience, showFavoritesOnly, selectedCategory]);

  // Show loading while checking auth
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Skeleton className="h-32 w-32 rounded-lg" />
      </div>
    );
  }

  // Main Content
  return (
    <div className="min-h-screen bg-background pt-20">{/* Added pt-20 for fixed header spacing */}
      {/* Header */}
      <header className="border-b border-border bg-card shadow-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-lg">
                101
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">החוברת המלאה</h1>
                <p className="text-sm text-muted-foreground">כל הפרומפטים במקום אחד</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={showFavoritesOnly ? "bg-accent" : ""}
              >
                <Heart className={`h-5 w-5 ${showFavoritesOnly ? "fill-current text-destructive" : ""}`} />
              </Button>
              
              <Button variant="outline" size="icon" onClick={toggleTheme}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <Button onClick={exportToPDF} className="gradient-primary text-white">
                <Download className="h-4 w-4 ml-2" />
                ייצוא ל-PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="חיפוש פרומפטים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 text-right"
            />
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 flex-1">
              <Select value={selectedAudience} onValueChange={setSelectedAudience}>
                <SelectTrigger className="text-right max-w-xs">
                  <SelectValue placeholder="בחר קהל יעד" />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCE_OPTIONS.map(audience => (
                    <SelectItem key={audience} value={audience}>
                      {audience}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="text-right max-w-xs">
                  <SelectValue placeholder="כל הקטגוריות" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="הכל">כל הקטגוריות</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('הכל');
                  setSelectedAudience('הכל');
                }}
                className="text-sm text-blue-600 hover:underline whitespace-nowrap"
              >
                אפס סינונים
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                  title="תצוגת קוביות"
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded ${viewMode === 'table' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                  title="תצוגת טבלה"
                >
                  <List size={20} />
                </button>
              </div>

              <p className="text-sm text-muted-foreground whitespace-nowrap">
                נמצאו {filteredPrompts.length} פרומפטים
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 shadow-card">
            <div className="text-sm text-muted-foreground">סך הכל פרומפטים</div>
            <div className="text-3xl font-bold text-foreground mt-1">{prompts.filter(p => p.visible).length}</div>
          </Card>
          
          <Card className="p-4 shadow-card">
            <div className="text-sm text-muted-foreground">פרומפטים מועדפים</div>
            <div className="text-3xl font-bold text-destructive mt-1">{favorites.length}</div>
          </Card>
          
          <Card className="p-4 shadow-card">
            <div className="text-sm text-muted-foreground">תוצאות חיפוש</div>
            <div className="text-3xl font-bold text-primary mt-1">{filteredPrompts.length}</div>
          </Card>
        </div>

        {/* Prompts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-10 w-full" />
              </Card>
            ))}
          </div>
        ) : filteredPrompts.length === 0 ? (
          <Card className="p-12 text-center shadow-card">
            <p className="text-xl text-muted-foreground">
              לא נמצאו פרומפטים התואמים לחיפוש
            </p>
          </Card>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedPrompts.map((prompt) => (
                  <Card
                    key={prompt.id}
                    className="p-6 shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <Badge 
                        variant="secondary" 
                        className="shrink-0"
                        style={{ 
                          backgroundColor: CATEGORY_COLORS[prompt.category] || "#95a5a6",
                          color: "white"
                        }}
                      >
                        {prompt.category}
                      </Badge>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="shrink-0">
                          {prompt.audience}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(prompt.id)}
                          className="h-8 w-8 shrink-0"
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              favorites.includes(prompt.id)
                                ? "fill-current text-destructive"
                                : ""
                            }`}
                          />
                        </Button>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-3 text-foreground">
                      {prompt.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 flex-grow leading-relaxed whitespace-pre-line">
                      {prompt.prompt}
                    </p>

                    <div className="space-y-3">
                      <Textarea
                        placeholder="הערות אישיות..."
                        value={notes[prompt.id] || ""}
                        onChange={(e) => updateNote(prompt.id, e.target.value)}
                        className="text-right min-h-[60px] text-sm"
                      />

                      <TooltipProvider>
                        <Tooltip open={copiedId === prompt.id}>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => copyToClipboard(prompt)}
                              className="w-full gradient-primary text-white"
                            >
                              <Copy className="h-4 w-4 ml-2" />
                              העתק
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>הועתק!</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-purple-100">
                      <th className="p-3 text-right border border-border">כותרת</th>
                      <th className="p-3 text-right border border-border">קטגוריה</th>
                      <th className="p-3 text-right border border-border">קהל יעד</th>
                      <th className="p-3 text-right border border-border">תוכן</th>
                      <th className="p-3 text-center border border-border">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPrompts.map((prompt) => (
                      <tr key={prompt.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="p-3 border border-border font-bold">{prompt.title}</td>
                        <td className="p-3 border border-border">
                          <span 
                            className="px-2 py-1 rounded text-sm text-white"
                            style={{ backgroundColor: CATEGORY_COLORS[prompt.category] || "#95a5a6" }}
                          >
                            {prompt.category}
                          </span>
                        </td>
                        <td className="p-3 border border-border">
                          <Badge variant="outline">{prompt.audience}</Badge>
                        </td>
                        <td className="p-3 border border-border text-sm max-w-md">
                          {prompt.prompt.substring(0, 100)}...
                        </td>
                        <td className="p-3 border border-border text-center">
                          <div className="flex items-center justify-center gap-2">
                            <TooltipProvider>
                              <Tooltip open={copiedId === prompt.id}>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    onClick={() => copyToClipboard(prompt)}
                                    className="gradient-primary text-white"
                                  >
                                    <Copy className="h-4 w-4 ml-1" />
                                    העתק
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>הועתק!</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleFavorite(prompt.id)}
                              className="h-8 w-8"
                            >
                              <Heart
                                className={`h-4 w-4 ${
                                  favorites.includes(prompt.id)
                                    ? "fill-current text-destructive"
                                    : ""
                                }`}
                              />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 bg-card">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            101 פרומפטים לשיווק חכם בלב פתוח | נבנה עם ❤️
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Full;
