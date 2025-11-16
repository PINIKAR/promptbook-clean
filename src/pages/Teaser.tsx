import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Copy, Search, ArrowLeft, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AUDIENCE_OPTIONS, CATEGORY_COLORS, ExternalPrompt } from "@/lib/constants";

const Teaser = () => {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<ExternalPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAudience, setSelectedAudience] = useState<string>("הכל");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Load saved search and audience from localStorage
    const savedQuery = localStorage.getItem("pb_query");
    const savedAudience = localStorage.getItem("pb_audience");
    if (savedQuery) setSearchQuery(savedQuery);
    if (savedAudience) setSelectedAudience(savedAudience);

    fetchPrompts();
  }, []);

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
        .eq('is_sample', true)
        .order('order', { ascending: true })
        .limit(12);

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!data || data.length === 0) {
        throw new Error("לא נמצאו פרומפטים");
      }

      // Map is_sample to isSample for compatibility
      const mappedPrompts = data.map(p => ({
        ...p,
        isSample: p.is_sample
      }));

      setPrompts(mappedPrompts);
    } catch (err) {
      console.error("Error fetching prompts:", err);
      const errorMessage = err instanceof Error ? err.message : "טעינת הנתונים נכשלה. נסה/י לרענן את העמוד.";
      setError(errorMessage);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFirstThreeLines = (text: string) => {
    const lines = text.split("\n").filter(line => line.trim() !== "");
    return lines.slice(0, 3).join("\n");
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

  // Filter prompts: only isSample=true, visible=true, sorted by order, max 12
  const filteredPrompts = prompts
    .filter(p => p.isSample && p.visible)
    .filter(p => {
      const matchesSearch = 
        searchQuery === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesAudience = selectedAudience === "הכל" || p.audience === selectedAudience;

      return matchesSearch && matchesAudience;
    })
    .sort((a, b) => a.order - b.order)
    .slice(0, 12);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-2">
            טעימה מתוך החוברת האינטראקטיבית
          </h1>
          <p className="text-lg text-muted-foreground text-center">
            101 פרומפטים לשיווק חכם בלב פתוח
          </p>
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

          <div className="flex items-center justify-between gap-4">
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

            <p className="text-sm text-muted-foreground">
              נמצאו {filteredPrompts.length} פרומפטים
            </p>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt) => (
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
                  <Badge variant="outline" className="shrink-0">
                    {prompt.audience}
                  </Badge>
                </div>

                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  {prompt.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-4 flex-grow leading-relaxed whitespace-pre-line">
                  {getFirstThreeLines(prompt.prompt)}
                  {prompt.prompt.split("\n").filter(l => l.trim()).length > 3 && "..."}
                </p>

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
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="p-8 shadow-card inline-block">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              רוצים לראות את כל הפרומפטים?
            </h2>
            <p className="text-muted-foreground mb-6">
              גשו לחוברת המלאה עם כל 101 הפרומפטים
            </p>
            <Button
              onClick={() => navigate("/full")}
              size="lg"
              className="gradient-primary text-white"
            >
              <ArrowLeft className="h-5 w-5 ml-2" />
              עבור לחוברת המלאה
            </Button>
          </Card>
        </div>
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

export default Teaser;
