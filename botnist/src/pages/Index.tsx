import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. CHECK SESSION ON LOAD
    // This handles the case where the user is already logged in
    // or has just been redirected back from Google with the #access_token
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // If we have a session, go straight to dashboard
        navigate("/dashboard");
      }
    };

    checkSession();

    // 2. SET UP LISTENER
    // This catches the exact moment Supabase processes the #hash token
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard");
      }
    });

    // Cleanup listener when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      {/* You can add more landing page sections (Features, Footer) here */}
    </div>
  );
};

export default Index;
