import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AuthModal } from "@/components/AuthModal";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();
  
  const leftItems = ["Product", "Pricing", "Changelog", "Company"];
  const rightItems = ["Contact"];

  // Check authentication state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Handle email verification status updates
        if (event === 'SIGNED_IN' && session.user.email_confirmed_at) {
          updateEmailVerificationStatus(session.user.id).catch(console.error);
        }
        
        // Handle OAuth sign-up completion
        if (event === 'SIGNED_IN' && session.user.app_metadata?.provider === 'google') {
          handleOAuthUserProfile(session.user).catch(console.error);
        }
        
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateEmailVerificationStatus = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          email_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating email verification status:', error);
      }
    } catch (error) {
      console.error('Error updating email verification:', error);
    }
  };

  const handleOAuthUserProfile = async (user: any) => {
    try {
      // Check if user profile already exists
      const { data: existingProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        // Create profile for OAuth user
        const { error } = await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              username: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              email: user.email,
              company_name: null,
              phone_number: null,
              user_type: 'free',
              bots_list: [],
              email_verified: true, // OAuth emails are pre-verified
              profile_completed: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);

        if (error) {
          console.error('Error creating OAuth user profile:', error);
        }
      }
    } catch (error) {
      console.error('Error handling OAuth user profile:', error);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        // If user profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          console.log('User profile not found, will be created on next login');
        } else {
          console.error('Error fetching user profile:', error);
        }
        return;
      }
      
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleNavigation = (item: string) => {
    if (item === "Product") {
      navigate("/product");
    } else if (item === "Pricing") {
      navigate("/pricing");
    } else if (item === "Changelog") {
      navigate("/changelog");
    } else if (item === "Contact") {
      navigate("/contact");
    }
    // Add more navigation logic for other items as needed
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account."
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <div className="text-xl font-bold text-wood-accent cursor-pointer" onClick={() => navigate("/")}>
              Forest Scribe
            </div>
            
            {/* Left Navigation Items */}
            <div className="hidden md:flex items-center space-x-6">
              {leftItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavigation(item)}
                  className="text-beige-text hover:text-wood-accent transition-smooth text-sm font-medium navbar-hover px-3 py-2 rounded-md cursor-pointer"
                >
                  <span className="relative z-10">{item}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Navigation Items */}
          <div className="flex items-center space-x-4">
            {rightItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavigation(item)}
                className="text-beige-text hover:text-wood-accent transition-smooth text-sm font-medium navbar-hover px-3 py-2 rounded-md cursor-pointer"
              >
                <span className="relative z-10">{item}</span>
              </button>
            ))}
            
            {user ? (
              // Authenticated user UI
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md bg-wood-accent/10 border border-wood-accent/20 hover:bg-wood-accent/20 transition-all duration-200 cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-wood-accent" />
                  <span className="text-sm font-medium text-foreground hover:text-wood-accent transition-colors">
                    {userProfile?.username || user.email?.split('@')[0]}
                  </span>
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-sm border-wood-accent/30 hover:bg-wood-accent/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              // Unauthenticated user UI
              <>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-beige-text hover:text-wood-accent transition-smooth text-sm font-medium navbar-hover px-3 py-2 rounded-md cursor-pointer"
                >
                  <span className="relative z-10">Sign In</span>
                </button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="relative z-10 navbar-btn-hover"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  <span className="relative z-10">Get Started</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;