import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client"; // Kept for setSession
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [tokenData, setTokenData] = useState<{ accessToken: string, refreshToken: string } | null>(null);
  
  const { toast } = useToast();

  // Check URL for tokens (Backend Redirect will likely send these as query params or hash)
  useEffect(() => {
    const checkSession = async () => {
      // 1. Check for tokens in URL (from Email Link)
      // Note: Supabase often puts tokens in the hash (#access_token=...), not query params. 
      // But we will support both for flexibility if you change auth flows.
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = searchParams.get('access_token') || hashParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token') || hashParams.get('refresh_token');
      const error = searchParams.get('error') || hashParams.get('error');
      const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');

      if (error) {
        toast({
          title: "Link Invalid",
          description: errorDescription || "Password reset link expired.",
          variant: "destructive"
        });
        return;
      }

      if (accessToken && refreshToken) {
        // We found tokens! Save them to send to backend later
        setTokenData({ accessToken, refreshToken });
        setIsValidSession(true);
        
        // Optional: Sync with local Supabase client immediately so UI reflects "Logged In" state
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      } 
      // 2. Fallback: Check if user is ALREADY logged in (e.g. they didn't close tab)
      else {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsValidSession(true);
          setTokenData({ 
            accessToken: session.access_token, 
            refreshToken: session.refresh_token 
          });
        }
      }
    };

    checkSession();
  }, [searchParams, toast]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidSession || !tokenData) {
      toast({ title: "Session expired", description: "Please request a new reset link.", variant: "destructive" });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({ title: "Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      // --- BACKEND INTEGRATION ---
      // We send the new password AND the token to verify identity
      const response = await fetch('${API_URL}/api/auth/update-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.accessToken}` // Bearer token used for auth middleware
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Update failed');
      }

      toast({
        title: "Success!",
        description: "Password updated. Please sign in."
      });

      // Logout to force re-login with new credentials
      await supabase.auth.signOut();
      navigate('/');

    } catch (error: any) {
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
    <div className="min-h-screen bg-background pt-24 pb-16 flex items-center justify-center">
      <div className="w-full max-w-md mx-4">
        {/* Glowing Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-wood-accent/20 to-forest-accent/20 rounded-xl blur-xl" />
        
        {/* Main Form Container */}
        <div className="relative bg-card/95 backdrop-blur-sm rounded-xl border-2 border-wood-accent/30 p-8 shadow-2xl">
          
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Reset Your Password
            </h1>
            <p className="text-muted-foreground">
              {isValidSession 
                ? "Enter your new password below."
                : "Validating reset link..."
              }
            </p>
          </div>

          {isValidSession ? (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-background/50 border-border focus:border-wood-accent"
                    placeholder="Enter your new password"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 bg-background/50 border-border focus:border-wood-accent"
                    placeholder="Confirm your new password"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-wood-accent hover:bg-wood-accent/90 text-background font-semibold transition-all duration-300 shadow-lg hover:shadow-glow"
              >
                {isLoading ? 'Updating Password...' : 'Update Password'}
              </Button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-wood-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Checking token...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;