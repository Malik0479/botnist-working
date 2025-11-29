import { useState, useEffect } from "react";
import { X, Mail, Lock, User, Building, Phone, ArrowLeft } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client"; // Kept only for setSession
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot';

interface SignInData {
  email: string;
  password: string;
}

interface SignUpData {
  email: string;
  password: string;
  username: string;
  companyName: string;
  phoneNumber: string;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [signInData, setSignInData] = useState<SignInData>({
    email: '',
    password: ''
  });
  const [signUpData, setSignUpData] = useState<SignUpData>({
    email: '',
    password: '',
    username: '',
    companyName: '',
    phoneNumber: ''
  });
  const [forgotEmail, setForgotEmail] = useState('');
  
  const { toast } = useToast();

  // Reset form data when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMode('signin');
      setSignInData({ email: '', password: '' });
      setSignUpData({ email: '', password: '', username: '', companyName: '', phoneNumber: '' });
      setForgotEmail('');
    }
  }, [isOpen]);

  // Close modal on Escape key and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // --- BACKEND INTEGRATION ---
      const response = await fetch('${API_URL}/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signInData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sign in failed');
      }

      // Manually sync the session to Frontend Client so other pages work
      if (data.session) {
        const { error } = await supabase.auth.setSession(data.session);
        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in."
        });
        onClose();
      }
    } catch (error: any) {
      toast({
        title: "Sign In Error", 
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // --- BACKEND INTEGRATION ---
      const response = await fetch('${API_URL}/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signUpData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed');
      }

      toast({
        title: "Check your email!",
        description: "We've sent you a verification link. Please check your email to complete registration."
      });
      onClose();

    } catch (error: any) {
      toast({
        title: "Sign Up Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      // --- BACKEND INTEGRATION ---
      // Redirect the browser directly to your backend OAuth route
      window.location.href = '${API_URL}/api/auth/google';
    } catch (error) {
      toast({
        title: "Google Sign Up Error",
        description: "Could not initiate Google Login",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // --- BACKEND INTEGRATION ---
      const response = await fetch('${API_URL}/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Reset failed');
      }

      toast({
        title: "Password reset sent!",
        description: "Check your email for the password reset link."
      });
      setMode('signin');
    } catch (error: any) {
      toast({
        title: "Reset Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-8 pt-60 pb-16 ${
      isOpen ? 'animate-in fade-in duration-300' : 'animate-out fade-out duration-200'
    }`}>
      <div 
        className={`absolute inset-0 bg-black/85 backdrop-blur-3xl transition-all duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        style={{
          backdropFilter: 'blur(24px) saturate(200%) brightness(0.3)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%) brightness(0.3)'
        }}
      />
      
      <div 
        className={`
          relative w-full mx-auto transform transition-all duration-700 ease-out
          ${mode === 'signup' ? 'max-w-2xl' : 'max-w-md'}
          ${isOpen 
            ? 'scale-100 opacity-100 translate-y-0 rotate-0' 
            : 'scale-75 opacity-0 translate-y-8 rotate-1'
          }
        `}
        style={{
          maxHeight: 'calc(100vh - 320px)',
          overflowY: 'auto'
        }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-wood-accent/40 to-forest-accent/40 rounded-xl blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-br from-wood-accent/30 to-forest-accent/30 rounded-xl blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-wood-accent/20 to-forest-accent/20 rounded-xl blur-xl" />
        
        <div className={`relative bg-card/98 backdrop-blur-sm rounded-xl border-2 border-wood-accent/40 shadow-2xl hover:border-wood-accent/60 transition-all duration-300 hover:shadow-glow max-h-full overflow-y-auto ${
          mode === 'signup' ? 'p-8' : 'p-6'
        }`}>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className={`text-center ${mode === 'signup' ? 'mb-8' : 'mb-6'}`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              {mode !== 'signin' && (
                <button
                  onClick={() => setMode('signin')}
                  className="p-1 rounded-full hover:bg-muted/50 transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
              <h2 className="text-2xl font-bold text-foreground">
                {mode === 'signin' && 'Welcome Back'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'forgot' && 'Reset Password'}
              </h2>
            </div>
            <p className="text-muted-foreground">
              {mode === 'signin' && 'Sign in to your Forest Scribe account'}
              {mode === 'signup' && 'Join Forest Scribe and start building AI chatbots'}
              {mode === 'forgot' && 'Enter your email to receive a reset link'}
            </p>
          </div>

          {/* Sign In Form */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-foreground font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signin-email"
                    type="email"
                    value={signInData.email}
                    onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 bg-background/50 border-border focus:border-wood-accent focus:ring-wood-accent/20"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-foreground font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signin-password"
                    type="password"
                    value={signInData.password}
                    onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 bg-background/50 border-border focus:border-wood-accent focus:ring-wood-accent/20"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full py-3 bg-wood-accent hover:bg-wood-accent/90 text-background font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-glow">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <div className="flex flex-col space-y-2 text-sm text-center">
                <button type="button" onClick={() => setMode('forgot')} className="text-wood-accent hover:text-wood-accent/80 transition-colors duration-200">
                  Forgot your password? Reset it
                </button>
                <button type="button" onClick={() => setMode('signup')} className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Not a user? <span className="text-wood-accent hover:text-wood-accent/80">Sign up</span>
                </button>
              </div>
            </form>
          )}

          {/* Sign Up Form */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-username" className="text-foreground font-medium">Username *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-username"
                      value={signUpData.username}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, username: e.target.value }))}
                      className="pl-10 bg-background/50 border-border focus:border-wood-accent focus:ring-wood-accent/20"
                      placeholder="johndoe"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-foreground font-medium">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 bg-background/50 border-border focus:border-wood-accent focus:ring-wood-accent/20"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-foreground font-medium">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 bg-background/50 border-border focus:border-wood-accent focus:ring-wood-accent/20"
                    placeholder="Create a strong password"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-company" className="text-foreground font-medium">Company</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-company"
                      value={signUpData.companyName}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, companyName: e.target.value }))}
                      className="pl-10 bg-background/50 border-border focus:border-wood-accent focus:ring-wood-accent/20"
                      placeholder="Your Company"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-phone" className="text-foreground font-medium">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-phone"
                      type="tel"
                      value={signUpData.phoneNumber}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="pl-10 bg-background/50 border-border focus:border-wood-accent focus:ring-wood-accent/20"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <Button type="button" onClick={handleGoogleSignUp} disabled={isLoading} variant="outline" className="w-full py-3 border-border hover:bg-muted/50 transition-all duration-300 hover:scale-105">
                <FcGoogle className="w-5 h-5 mr-3" />
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full py-3 bg-wood-accent hover:bg-wood-accent/90 text-background font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-glow">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <div className="text-sm text-center">
                <button type="button" onClick={() => setMode('signin')} className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Already have an account? <span className="text-wood-accent hover:text-wood-accent/80">Sign in</span>
                </button>
              </div>
            </form>
          )}

          {/* Forgot Password Form */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email" className="text-foreground font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-border focus:border-wood-accent focus:ring-wood-accent/20"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full py-3 bg-wood-accent hover:bg-wood-accent/90 text-background font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-glow">
                {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};