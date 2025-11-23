import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Upload, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Session } from "@supabase/supabase-js";
import Logo from "@/components/Logo";

// הגדרת טיפוס פשוטה כדי למנוע שגיאות
type Prompt = {
  id: string;
  title: string;
  prompt: string;
  category: string;
  audience: string;
  is_sample: boolean;
  visible: boolean;
  order: number;
};

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
  const [formData, setFormData] = useState({
    title: "",
    prompt: "",
    category: "",
    audience: "כללי",
    is_sample: false,
    visible: true,
    order: 0,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // --- התיקון הגדול: בדיקת מנהל לפי אימייל ---
      const userEmail = session.user.email;
      const isUserAdmin = userEmail === 'pninakar@gmail.com';

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
  }, [navigate]);

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .order("order", { ascending: true });

      if (error) throw error;
      
      // המרה בטוחה של הנתונים
      const safePrompts = (data || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        prompt: p.prompt,
        category: p.category,
        audience: p.audience || "כללי",
        is_sample: p.is_sample || false,
        visible: p.visible || true,
        order: p.order || 0
      }));

      setPrompts(safePrompts);
    } catch (error) {
      console.error(error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון את הפרומפטים",
        variant: "destructive",
      });
    }
  };

  // פונקציה לטיפול בפתיחת הדיאלוג (עריכה או חדש)
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
        order: prompts.length + 1,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPrompt) {
        // עדכון קיים
        const { error } = await supabase
          .from("prompts")
          .update(formData)
          .eq("id", editingPrompt.id);

        if (error) throw error;
        toast({ title: "פרומפט עודכן בהצלחה!" });
      } else {
        // יצירת חדש
        const { error } = await supabase.from("prompts").insert([formData]);

        if (error) throw error;
        toast({ title: "פרומפט נוסף בהצלחה!" });
      }

      setIsDialogOpen(false);
      fetchPrompts();
    } catch (error) {
      console.error(error);
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
      toast({ title: "פרומפט נמחק בהצלחה!" });
      fetchPrompts();
    } catch (error) {
      toast({ title: "שגיאה במחיקה", variant: "destructive" });
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
      toast({ title: "שגיאה בעדכון", variant: "destructive" });
    }
  };

  const handleMoveOrder = async (prompt: Prompt, direction: "up" | "down") => {
    // לוגיקה פשוטה להחלפת סדר (אופציונלי לשיפור בעתיד)
    toast({ title: "שינוי סדר", description: "פיצ'ר זה בפיתוח כרגע" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-purple-600 animate-pulse">טוען פאנל ניהול...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="border-b border-border bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-800">פאנל ניהול</h1>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Admin</span>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={() => window.location.href = '/'} variant="outline" size="sm">
                <Home className="h-4 w-4 ml-2" />
                חזרה לאתר
              </Button>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenDialog()} className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="h-4 w-4 ml-2" />
                    הוסף פרומפט
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto text-right" dir="rtl">
                  <DialogHeader>
                    <DialogTitle>{editingPrompt ? "ערוך פרומפט" : "הוסף פרומפט חדש"}</DialogTitle>
                    <DialogDescription>מלא את הפרטים למטה ולחץ על שמור</DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                      <Label>כותרת</Label>
                      <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                    </div>
                    <div>
                      <Label>טקסט הפרומפט</Label>
                      <Textarea value={formData.prompt} onChange={(e) => setFormData({ ...formData, prompt: e.target.value })} required rows={5} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>קטגוריה</Label>
                        <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
                      </div>
                      <div>
                        <Label>קהל יעד</Label>
                        <Select value={formData.audience} onValueChange={(value) => setFormData({ ...formData, audience: value })}>
                          <SelectTrigger><SelectValue placeholder="בחר" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="כללי">כללי</SelectItem>
                            <SelectItem value="בעלי עסקים">בעלי עסקים</SelectItem>
                            <SelectItem value="יוצרים">יוצרים</SelectItem>
                            <SelectItem value="מטפלים">מטפלים</SelectItem>
                            <SelectItem value="איקומרס">איקומרס</SelectItem>
                            <SelectItem value="משווקים">משווקים</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="flex items-center gap-2">
                        <Checkbox id="visible" checked={formData.visible} onCheckedChange={(c) => setFormData({ ...formData, visible: c as boolean })} />
                        <Label htmlFor="visible">מוצג באתר (Visible)</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="sample" checked={formData.is_sample} onCheckedChange={(c) => setFormData({ ...formData, is_sample: c as boolean })} />
                        <Label htmlFor="sample">דוגמה חינם (Sample)</Label>
                      </div>
                    </div>
                    <div>
                      <Label>סדר הופעה</Label>
                      <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: +e.target.value })} />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>ביטול</Button>
                      <Button type="submit" className="bg-purple-600 text-white">שמור</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="overflow-hidden border shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-right w-[60px]">סדר</TableHead>
                <TableHead className="text-right">כותרת</TableHead>
                <TableHead className="text-right">קטגוריה</TableHead>
                <TableHead className="text-right">קהל</TableHead>
                <TableHead className="text-center">חינם?</TableHead>
                <TableHead className="text-center">מוצג?</TableHead>
                <TableHead className="text-center w-[100px]">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prompts.map((prompt) => (
                <TableRow key={prompt.id}>
                  <TableCell className="font-medium">{prompt.order}</TableCell>
                  <TableCell>{prompt.title}</TableCell>
                  <TableCell><span className="bg-gray-100 px-2 py-1 rounded text-xs">{prompt.category}</span></TableCell>
                  <TableCell>{prompt.audience}</TableCell>
                  <TableCell className="text-center">
                    <Checkbox checked={prompt.is_sample} onCheckedChange={() => handleToggle(prompt, "is_sample")} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox checked={prompt.visible} onCheckedChange={() => handleToggle(prompt, "visible")} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(prompt)}>
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(prompt.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
};

export default Admin;