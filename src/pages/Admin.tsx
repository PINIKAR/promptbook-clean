import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Upload, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";
import type { Session } from "@supabase/supabase-js";
import Logo from "@/components/Logo";

type Prompt = Tables<"prompts">;

// Zod validation schema for imported prompts
const promptSchema = z.object({
  title: z.string().min(1).max(200),
  prompt: z.string().min(1).max(5000),
  category: z.string().min(1).max(100),
  audience: z.enum(['כללי', 'בעלי עסקים', 'יוצרים', 'מטפלים']),
  isSample: z.boolean().default(false),
  visible: z.boolean().default(true),
  order: z.number().int().min(0).optional()
});

const promptsArraySchema = z.array(promptSchema);

const Admin = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<{
    title: string;
    prompt: string;
    category: string;
    audience: string;
    is_sample: boolean;
    visible: boolean;
    order: number;
  }>({
    title: "",
    prompt: "",
    category: "",
    audience: "כללי",
    is_sample: false,
    visible: true,
    order: 0,
  });

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if user is admin using database query
      const { data: adminData } = await supabase
        .from('admins')
        .select('email')
        .eq('email', session.user.email)
        .single();
      
      const isUserAdmin = !!adminData;

      if (isUserAdmin) {
        setIsAdmin(true);
        fetchPrompts();
      } else {
        toast({
          title: "גישה נדחתה",
          description: "אין לך הרשאות גישה לעמוד זה",
          variant: "destructive",
        });
        navigate("/");
      }
      
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      } else {
        // Check admin status from database
        const { data: adminData } = await supabase
          .from('admins')
          .select('email')
          .eq('email', session.user.email)
          .single();
        
        if (!adminData) {
          navigate("/");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .order("order", { ascending: true });

      if (error) throw error;
      setPrompts(data || []);
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון את הפרומפטים",
        variant: "destructive",
      });
    }
  };

  const handleImportFromGitHub = async () => {
    if (!confirm("פעולה זו תמחק את כל הפרומפטים הקיימים ותחליף אותם בנתונים מ-GitHub. האם להמשיך?")) {
      return;
    }

    setIsImporting(true);
    try {
      // Call Edge Function to fetch from GitHub
      const { data: githubResponse, error: functionError } = await supabase.functions.invoke(
        'import-github-prompts',
        {
          body: {
            username: 'PINIKAR',
            repo: 'promptbook-hebrew-hub',
            path: 'prompts.json'
          }
        }
      );

      if (functionError) throw functionError;
      if (!githubResponse?.success) {
        throw new Error(githubResponse?.error || 'Failed to fetch from GitHub');
      }

      const data = githubResponse.data;
      const promptsData = data.prompts;

      if (!promptsData || !Array.isArray(promptsData)) {
        throw new Error('Invalid data format from GitHub');
      }

      // Validate data structure before any database operations
      const validationResult = promptsArraySchema.safeParse(promptsData);
      if (!validationResult.success) {
        throw new Error(`נתונים לא תקינים: ${validationResult.error.errors[0].message}`);
      }

      const validatedPrompts = validationResult.data;

      // Delete all existing prompts
      const { error: deleteError } = await supabase
        .from("prompts")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (deleteError) throw deleteError;

      // Insert new prompts with proper field mapping using validated data
      const promptsToInsert = validatedPrompts.map((p, index: number) => ({
        title: p.title,
        prompt: p.prompt,
        category: p.category,
        audience: p.audience,
        is_sample: p.isSample,
        visible: p.visible,
        order: p.order ?? index,
      }));

      const { error: insertError } = await supabase
        .from("prompts")
        .insert(promptsToInsert);

      if (insertError) throw insertError;

      toast({
        title: "ייבוא הושלם בהצלחה!",
        description: `${promptsToInsert.length} פרומפטים יובאו מ-GitHub`,
      });

      fetchPrompts();
    } catch (error) {
      toast({
        title: "שגיאה בייבוא",
        description: error instanceof Error ? error.message : "לא ניתן לייבא את הפרומפטים מ-GitHub",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleOpenDialog = (prompt?: Prompt) => {
    if (prompt) {
      setEditingPrompt(prompt);
      setFormData({
        title: prompt.title,
        prompt: prompt.prompt,
        category: prompt.category,
        audience: prompt.audience,
        is_sample: prompt.is_sample,
        visible: prompt.visible,
        order: prompt.order,
      });
    } else {
      setEditingPrompt(null);
      setFormData({
        title: "",
        prompt: "",
        category: "",
        audience: "כללי",
        is_sample: false,
        visible: true,
        order: prompts.length,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPrompt) {
        // Update existing prompt
        const { error } = await supabase
          .from("prompts")
          .update(formData)
          .eq("id", editingPrompt.id);

        if (error) throw error;

        toast({
          title: "פרומפט עודכן בהצלחה!",
        });
      } else {
        // Create new prompt
        const { error } = await supabase.from("prompts").insert([formData]);

        if (error) throw error;

        toast({
          title: "פרומפט נוסף בהצלחה!",
        });
      }

      setIsDialogOpen(false);
      fetchPrompts();
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לשמור את הפרומפט",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק פרומפט זה?")) return;

    try {
      const { error } = await supabase.from("prompts").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "פרומפט נמחק בהצלחה!",
      });

      fetchPrompts();
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן למחוק את הפרומפט",
        variant: "destructive",
      });
    }
  };

  const handleToggle = async (prompt: Prompt, field: "is_sample" | "visible") => {
    try {
      const { error } = await supabase
        .from("prompts")
        .update({ [field]: !prompt[field] })
        .eq("id", prompt.id);

      if (error) throw error;

      fetchPrompts();
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לעדכן את הפרומפט",
        variant: "destructive",
      });
    }
  };

  const handleMoveOrder = async (prompt: Prompt, direction: "up" | "down") => {
    const currentIndex = prompts.findIndex((p) => p.id === prompt.id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= prompts.length) return;

    const targetPrompt = prompts[targetIndex];

    try {
      // Swap order values
      await supabase
        .from("prompts")
        .update({ order: targetPrompt.order })
        .eq("id", prompt.id);

      await supabase
        .from("prompts")
        .update({ order: prompt.order })
        .eq("id", targetPrompt.id);

      fetchPrompts();
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לעדכן את הסדר",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">טוען...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <h1 className="text-2xl font-bold">פאנל ניהול - Admin</h1>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
              >
                <Home className="h-4 w-4 ml-2" />
                חזרה לדף הבית
              </Button>
              
              <Button
                onClick={handleImportFromGitHub}
                disabled={isImporting}
                variant="outline"
              >
                <Upload className="h-4 w-4 ml-2" />
                {isImporting ? "מייבא..." : "ייבוא מגיטהאב"}
              </Button>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => handleOpenDialog()}
                    className="gradient-primary text-white"
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    הוסף פרומפט חדש
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPrompt ? "ערוך פרומפט" : "הוסף פרומפט חדש"}
                    </DialogTitle>
                    <DialogDescription>
                      מלא את הפרטים למטה ולחץ על שמור
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">כותרת</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        required
                        className="text-right"
                      />
                    </div>

                    <div>
                      <Label htmlFor="prompt">טקסט הפרומפט</Label>
                      <Textarea
                        id="prompt"
                        value={formData.prompt}
                        onChange={(e) =>
                          setFormData({ ...formData, prompt: e.target.value })
                        }
                        required
                        rows={6}
                        className="text-right"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">קטגוריה</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                          }
                          required
                          className="text-right"
                        />
                      </div>

                      <div>
                        <Label htmlFor="audience">קהל יעד</Label>
                        <Select
                          value={formData.audience}
                          onValueChange={(value: "בעלי עסקים" | "יוצרים" | "כללי" | "מטפלים") =>
                            setFormData({ ...formData, audience: value })
                          }
                        >
                          <SelectTrigger className="text-right">
                            <SelectValue placeholder="בחר קהל יעד" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="כללי">כללי</SelectItem>
                            <SelectItem value="בעלי עסקים">בעלי עסקים</SelectItem>
                            <SelectItem value="יוצרים">יוצרים</SelectItem>
                            <SelectItem value="מטפלים">מטפלים</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id="is_sample"
                          checked={formData.is_sample}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, is_sample: checked as boolean })
                          }
                        />
                        <Label htmlFor="is_sample">להציג בפרומו (Sample)</Label>
                      </div>

                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id="visible"
                          checked={formData.visible}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, visible: checked as boolean })
                          }
                        />
                        <Label htmlFor="visible">גלוי (Visible)</Label>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="order">סדר</Label>
                      <Input
                        id="order"
                        type="number"
                        value={formData.order}
                        onChange={(e) =>
                          setFormData({ ...formData, order: parseInt(e.target.value) })
                        }
                        required
                        className="text-right"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        ביטול
                      </Button>
                      <Button type="submit" className="gradient-primary">
                        שמור
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={() => navigate("/")}>
                חזרה לאתר
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">טוען...</div>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">סדר</TableHead>
                    <TableHead className="text-right">כותרת</TableHead>
                    <TableHead className="text-right">קטגוריה</TableHead>
                    <TableHead className="text-right">קהל יעד</TableHead>
                    <TableHead className="text-center">Sample</TableHead>
                    <TableHead className="text-center">Visible</TableHead>
                    <TableHead className="text-center">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prompts.map((prompt, index) => (
                    <TableRow key={prompt.id}>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1">
                          <span>{prompt.order}</span>
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleMoveOrder(prompt, "up")}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleMoveOrder(prompt, "down")}
                              disabled={index === prompts.length - 1}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {prompt.title}
                      </TableCell>
                      <TableCell className="text-right">{prompt.category}</TableCell>
                      <TableCell className="text-right">{prompt.audience}</TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={prompt.is_sample}
                          onCheckedChange={() => handleToggle(prompt, "is_sample")}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={prompt.visible}
                          onCheckedChange={() => handleToggle(prompt, "visible")}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(prompt)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(prompt.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {!loading && prompts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            אין עדיין פרומפטים. לחץ על "הוסף פרומפט חדש" כדי להתחיל.
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
