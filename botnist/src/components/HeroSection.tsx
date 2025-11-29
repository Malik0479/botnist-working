import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Link, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const HeroSection = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let targetUrl = url.trim();
    if (!targetUrl) return;

    // FIX: Automatically add https:// if missing
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    // Basic validation to ensure it looks like a domain
    if (!targetUrl.includes(".")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website address (e.g., google.com)",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. CHECK AUTH
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        localStorage.setItem('pendingScrapeUrl', targetUrl); 
        toast({
          title: "Login Required",
          description: "Please sign in to analyze websites.",
        });
        navigate('/auth'); 
        return;
      }

      // 2. SEND TO BACKEND
      const response = await fetch('http://localhost:5000/api/scrape/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ url: targetUrl }) // Send the fixed URL
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle Token Expiration / Invalid Token from Backend
        if (response.status === 401) {
          toast({
            title: "Session Expired",
            description: "Please log in again.",
            variant: "destructive"
          });
          await supabase.auth.signOut();
          navigate('/auth');
          return;
        }
        throw new Error(result.message || "Analysis failed to start");
      }

      toast({
        title: "Analysis Started!",
        description: "Redirecting you to the dashboard...",
      });
      
      navigate('/dashboard');

    } catch (error: any) {
      console.error("Analysis Error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen bg-hero-gradient overflow-hidden">
      <div className="container mx-auto px-6 py-24 pt-32">
        <div className="flex flex-col lg:flex-row w-full min-h-screen">
          {/* Left content */}
          <div className="w-full lg:w-1/2 p-8">
            <div className="space-y-8 z-10 relative">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold text-beige-text leading-tight">
                  Turn any website
                  <br />
                  <span className="text-wood-accent drop-shadow-lg">into a Chatbot</span>
                  <br />
                  in seconds
                </h1>
                
                <p className="text-xl lg:text-2xl text-beige-muted max-w-lg leading-relaxed">
                  Enter a URL, we scrape the data, and give you a custom API key to power your AI.
                </p>
              </div>

              {/* URL Input Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
                  <div className="relative flex-1 btn-hover-box">
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-wood-accent h-5 w-5 z-10" />
                    <Input
                      type="text" // CHANGED from 'url' to 'text' to prevent browser blocking
                      placeholder="example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={isLoading}
                      className="pl-10 py-6 text-lg bg-secondary/70 border-forest-accent/50 text-beige-text placeholder:text-beige-muted/70 focus:ring-wood-accent focus:border-wood-accent backdrop-blur-sm"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    variant="default" 
                    size="lg" 
                    disabled={isLoading}
                    className="group relative z-10 h-auto py-3 bg-wood-accent hover:bg-wood-accent/90 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">Analyze</span>
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
                      </>
                    )}
                  </Button>
                </div>
                
                <p className="text-sm text-beige-muted/80">
                  Get instant insights about your website's performance and optimization opportunities
                </p>
              </form>
            </div>
          </div>
          
          {/* Right animation container */}
          <div className="relative w-full lg:w-1/2 h-[500px] lg:h-screen">
            <div className="wood-pattern-container">
              {/* Animation Elements */}
              <div className="wood-grain wood-grain-1"></div>
              <div className="wood-grain wood-grain-2"></div>
              <div className="wood-grain wood-grain-3"></div>
              <div className="wood-grain wood-grain-4"></div>
              <div className="wood-grain wood-grain-5"></div>
              <div className="wood-grain wood-grain-6"></div>
              <div className="wood-grain wood-grain-7"></div>
              <div className="wood-grain wood-grain-8"></div>
              <div className="wood-grain wood-grain-9"></div>
              <div className="wood-grain wood-grain-10"></div>
              <div className="wood-grain wood-grain-11"></div>
              <div className="wood-grain wood-grain-12"></div>
              <div className="floating-element floating-element-1"></div>
              <div className="floating-element floating-element-2"></div>
              <div className="floating-element floating-element-3"></div>
              <div className="floating-element floating-element-4"></div>
              <div className="floating-element floating-element-5"></div>
              <div className="floating-element floating-element-6"></div>
              <div className="floating-element floating-element-7"></div>
              <div className="floating-element floating-element-8"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/20 to-transparent" />
    </section>
  );
};

export default HeroSection;