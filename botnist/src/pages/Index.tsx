import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const handleAuthRedirect = async () => {
      // 1. Check for Hash (OAuth Redirect)
      // This happens immediately when Google sends you back
      if (window.location.hash.includes("access_token")) {
        console.log("OAuth Redirect detected...");
        
        // Wait a tiny bit for Supabase client to process the hash
        await new Promise(r => setTimeout(r, 500));
        
        const { data: { session } } = await supabase.auth.getSession();
        if (session && mounted) {
          console.log("Session established via OAuth");
          navigate("/dashboard");
          return;
        }
      }

      // 2. Check Standard Session (Already logged in)
      const { data: { session } } = await supabase.auth.getSession();
      if (session && mounted) {
        console.log("Existing session found");
        navigate("/dashboard");
      }
    };

    handleAuthRedirect();

    // 3. Real-time Listener (The Backup)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        console.log("Auth State Changed: Signed In");
        navigate("/dashboard");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
    </div>
  );
};

export default Index;
