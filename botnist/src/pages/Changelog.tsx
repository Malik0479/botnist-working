import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Tag, 
  Star, 
  CheckCircle, 
  Zap, 
  Bug, 
  ArrowUpRight,
  Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChangelogEntry {
  id: string;
  version: string;
  title: string;
  description: string;
  release_date: string;
  release_type: 'major' | 'minor' | 'patch' | 'hotfix';
  features: string[];
  improvements: string[];
  bug_fixes: string[];
  is_featured: boolean;
  created_at: string;
}

const Changelog = () => {
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchChangelog();
  }, []);

  const fetchChangelog = async () => {
    try {
      const { data, error } = await supabase
        .from('changelog')
        .select('*')
        .order('release_date', { ascending: false });

      if (error) {
        throw error;
      }

      setChangelog(data || []);
    } catch (error) {
      console.error('Error fetching changelog:', error);
      toast({
        title: "Error loading changelog",
        description: "Unable to load the changelog. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getReleaseTypeColor = (type: string) => {
    switch (type) {
      case 'major':
        return 'bg-purple-500 hover:bg-purple-600 text-white';
      case 'minor':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'patch':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'hotfix':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getVersionIcon = (type: string) => {
    switch (type) {
      case 'major':
        return <Star className="w-5 h-5" />;
      case 'minor':
        return <Zap className="w-5 h-5" />;
      case 'patch':
        return <CheckCircle className="w-5 h-5" />;
      case 'hotfix':
        return <Bug className="w-5 h-5" />;
      default:
        return <Tag className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-wood-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading changelog...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-8">
            <span className="text-wood-accent">Changelog</span>
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
            Stay up to date with the latest features, improvements, and bug fixes for Forest Scribe.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {changelog.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Updates Yet</h3>
                <p className="text-muted-foreground">
                  The changelog will appear here once we start releasing updates.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {changelog.map((entry, index) => (
                <div key={entry.id} className="relative">
                  {/* Timeline line */}
                  {index !== changelog.length - 1 && (
                    <div className="absolute left-8 top-24 w-0.5 h-full bg-border -z-10" />
                  )}
                  
                  <Card className={`relative border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                    entry.is_featured 
                      ? 'border-wood-accent/50 bg-gradient-to-r from-wood-accent/5 to-forest-accent/5' 
                      : 'border-border hover:border-wood-accent/30'
                  }`}>
                    
                    {/* Featured badge */}
                    {entry.is_featured && (
                      <div className="absolute -top-3 left-6">
                        <Badge className="bg-wood-accent text-background font-semibold px-3 py-1">
                          <Star className="w-3 h-3 mr-1" />
                          Featured Release
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          {/* Version icon */}
                          <div className={`p-3 rounded-full ${getReleaseTypeColor(entry.release_type)}`}>
                            {getVersionIcon(entry.release_type)}
                          </div>
                          
                          <div>
                            <CardTitle className="text-2xl font-bold text-foreground mb-2">
                              {entry.title}
                            </CardTitle>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Tag className="w-4 h-4" />
                                <span className="font-mono font-semibold">v{entry.version}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(entry.release_date)}</span>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`${getReleaseTypeColor(entry.release_type)} border-0 text-xs`}
                              >
                                {entry.release_type.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Description */}
                      <div>
                        <p className="text-muted-foreground leading-relaxed">
                          {entry.description}
                        </p>
                      </div>

                      {/* Features, Improvements, Bug Fixes */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Features */}
                        {entry.features && entry.features.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <Zap className="w-4 h-4 text-blue-500" />
                              New Features
                            </h4>
                            <ul className="space-y-2">
                              {entry.features.map((feature, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <ArrowUpRight className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Improvements */}
                        {entry.improvements && entry.improvements.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Improvements
                            </h4>
                            <ul className="space-y-2">
                              {entry.improvements.map((improvement, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <ArrowUpRight className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  {improvement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Bug Fixes */}
                        {entry.bug_fixes && entry.bug_fixes.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <Bug className="w-4 h-4 text-red-500" />
                              Bug Fixes
                            </h4>
                            <ul className="space-y-2">
                              {entry.bug_fixes.map((bugFix, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <ArrowUpRight className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                                  {bugFix}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-wood-accent/10 to-forest-accent/10 border-wood-accent/30">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Stay Updated
                </h3>
                <p className="text-muted-foreground mb-6">
                  Want to be notified about new releases? Follow our updates!
                </p>
                <Button 
                  className="bg-wood-accent hover:bg-wood-accent/90 text-background"
                  onClick={() => window.open('https://github.com/forest-scribe', '_blank')}
                >
                  Follow on GitHub
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Changelog;