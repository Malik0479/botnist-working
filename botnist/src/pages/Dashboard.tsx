import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  Plus, 
  Copy, 
  Check, 
  Loader2, 
  Terminal, 
  LogOut,
  Trash2 // <--- ADDED THIS MISSING IMPORT
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BotEntry {
  job_hash: string; // This is the API KEY
  target_url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [bots, setBots] = useState<BotEntry[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndLoadBots();
  }, []);

  const checkAuthAndLoadBots = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return navigate('/auth');

    // Fetch existing bots (scraping_jobs table)
    const { data } = await supabase
      .from('scraping_jobs')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (data) setBots(data);
    setIsLoading(false);
  };

  const handleCreateBot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    setIsCreating(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return navigate('/auth');

      // 1. Call Backend to Start Automation
      const response = await fetch('http://localhost:5000/api/scrape/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ url: newUrl })
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Failed to create bot");

      toast({ title: "Bot Created", description: "Scraping started. Your API Key is ready." });

      // 2. Add to list immediately
      setBots(prev => [{
        job_hash: result.jobHash,
        target_url: newUrl,
        status: 'processing',
        created_at: new Date().toISOString()
      }, ...prev]);

      setNewUrl(""); // Clear input

    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteBot = async (job_hash: string) => {
    if (!confirm("Are you sure you want to delete this bot?")) return;
  
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
  
      // Call DELETE endpoint
      const response = await fetch(`http://localhost:5000/api/scrape/bot/${job_hash}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
  
      if (response.ok) {
        // Remove from UI immediately
        setBots(prev => prev.filter(b => b.job_hash !== job_hash));
        toast({ title: "Bot deleted" });
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      toast({ title: "Error deleting bot", variant: "destructive" });
    }
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000); // Reset icon after 2s
    toast({ title: "Copied!", description: "API Key copied to clipboard." });
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-wood-accent" /></div>;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Chatbots</h1>
            <p className="text-muted-foreground">Manage your active bots and API keys.</p>
          </div>
          <Button variant="outline" onClick={() => { supabase.auth.signOut(); navigate('/auth'); }}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>

        <Tabs defaultValue="bots" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bots">Active Bots</TabsTrigger>
            <TabsTrigger value="docs">Integration Guide</TabsTrigger>
          </TabsList>

          {/* TAB 1: CREATE & LIST BOTS */}
          <TabsContent value="bots" className="space-y-6">
            
            {/* Create New Bot Section */}
            <Card className="border-wood-accent/20 bg-wood-accent/5">
              <CardHeader>
                <CardTitle>Create New Bot</CardTitle>
                <CardDescription>Enter a website URL. We will scrape it and give you an API Key.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateBot} className="flex gap-4">
                  <Input 
                    placeholder="https://example.com" 
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="bg-background"
                  />
                  <Button type="submit" disabled={isCreating || !newUrl} className="bg-wood-accent hover:bg-wood-accent/90 min-w-[140px]">
                    {isCreating ? <Loader2 className="animate-spin" /> : <><Plus className="mr-2 h-4 w-4" /> Create Bot</>}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* List of Bots */}
            <div className="grid gap-4">
              {bots.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  No bots yet. Create one above!
                </div>
              ) : (
                bots.map((bot) => (
                  <Card key={bot.job_hash} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4">
                      
                      {/* Bot Info */}
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${bot.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          <Bot className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{bot.target_url}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={bot.status === 'completed' ? 'default' : 'secondary'} className={bot.status === 'completed' ? 'bg-green-600' : ''}>
                              {bot.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">Created: {new Date(bot.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* API Key & Actions */}
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg border border-border flex-1 md:flex-none">
                          <Terminal className="w-4 h-4 text-muted-foreground ml-2" />
                          <code className="text-sm font-mono text-foreground truncate w-[180px]">
                            {bot.job_hash}
                          </code>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => copyToClipboard(bot.job_hash)}
                            className="h-8 w-8 p-0"
                          >
                            {copiedKey === bot.job_hash ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>

                        {/* Delete Button */}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-10 w-10 p-0"
                          onClick={() => handleDeleteBot(bot.job_hash)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* TAB 2: INSTRUCTION GUIDE */}
          <TabsContent value="docs">
            <Card>
              <CardHeader>
                <CardTitle>How to use your API Key</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Add this script to your website's <code>&lt;head&gt;</code> tag:</p>
                <div className="bg-black text-gray-300 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  {`<script src="https://cdn.botnist.com/widget.js"></script>`}
                  <br />
                  {`<script>`}
                  <br />
                  {`  Botnist.init({ apiKey: "YOUR_API_KEY_HERE" });`}
                  <br />
                  {`</script>`}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;