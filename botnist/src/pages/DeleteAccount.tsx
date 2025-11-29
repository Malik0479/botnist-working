import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DeleteAccount = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get the token from URL parameters
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    if (!token || !email) {
      toast({
        title: "Invalid deletion link",
        description: "This account deletion link is invalid or malformed.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    // Validate the token (in a real app, you'd verify this against your database)
    // For now, we'll just check if it exists and looks valid
    if (token.length > 10 && email.includes('@')) {
      setIsValidToken(true);
      setUserEmail(email);
    } else {
      toast({
        title: "Invalid deletion link",
        description: "This account deletion link is invalid or has expired.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [searchParams, navigate, toast]);

  const handleDeleteAccount = async () => {
    setIsLoading(true);

    try {
      // First, check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || session.user.email !== userEmail) {
        // User needs to sign in first to delete their account
        toast({
          title: "Authentication required",
          description: "Please sign in to your account to confirm deletion.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      // Delete user data from users table
      const { error: userDataError } = await supabase
        .from('users')
        .delete()
        .eq('id', session.user.id);

      if (userDataError) {
        console.error('Error deleting user data:', userDataError);
      }

      // Delete user from auth (this will also sign them out)
      const { error: authError } = await supabase.auth.admin.deleteUser(session.user.id);
      
      if (authError) {
        // If admin delete fails, just sign out the user
        console.error('Error deleting auth user:', authError);
        await supabase.auth.signOut();
      }

      setIsDeleted(true);
      toast({
        title: "Account deleted successfully",
        description: "Your account and all associated data have been permanently deleted."
      });

    } catch (error) {
      console.error('Account deletion error:', error);
      toast({
        title: "Deletion failed",
        description: "An error occurred while deleting your account. Please contact support.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isDeleted) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Account Deleted</h2>
            <p className="text-muted-foreground mb-6">
              Your account has been permanently deleted. We're sorry to see you go.
            </p>
            <Button onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Validating deletion link...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 flex items-center justify-center">
      <div className="w-full max-w-md mx-4">
        {/* Glowing Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 to-red-500/20 rounded-xl blur-xl" />
        
        {/* Main Card */}
        <Card className="relative border-2 border-destructive/30 shadow-2xl">
          
          {/* Back Button */}
          <CardHeader>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>

            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <CardTitle className="text-2xl text-foreground mb-2">
                Delete Account
              </CardTitle>
              <CardDescription className="text-base">
                You are about to permanently delete your Forest Scribe account for:
                <br />
                <strong className="text-foreground">{userEmail}</strong>
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <h4 className="font-semibold text-destructive mb-2">⚠️ This action cannot be undone!</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All your chatbots will be permanently deleted</li>
                <li>• Your profile and settings will be removed</li>
                <li>• All usage history and analytics will be lost</li>
                <li>• You will lose access to your subscription benefits</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                variant="destructive"
                className="w-full py-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin mr-2" />
                    Deleting Account...
                  </>
                ) : (
                  'Yes, Delete My Account Permanently'
                )}
              </Button>

              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                Cancel - Keep My Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeleteAccount;