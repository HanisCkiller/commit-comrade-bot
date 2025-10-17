import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Github, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const RepoInput = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) {
      toast.error("Please enter a GitHub repository URL");
      return;
    }

    // Basic GitHub URL validation
    const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
    if (!githubUrlPattern.test(repoUrl)) {
      toast.error("Please enter a valid GitHub repository URL");
      return;
    }

    setIsAnalyzing(true);
    
    // Placeholder for actual analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success("Repository analysis will be implemented in the next step!");
    }, 2000);
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-3xl" />
          
          {/* Card */}
          <div className="relative bg-card border border-border rounded-2xl p-8 md:p-12 backdrop-blur-sm">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                  <Github className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Start Learning Now
                </h2>
                <p className="text-muted-foreground">
                  Enter any GitHub repository URL to generate your personalized tutorial
                </p>
              </div>

              {/* Input Group */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Input
                    type="url"
                    placeholder="https://github.com/username/repository"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                    className="h-14 text-base pl-12 pr-4 bg-background/50 border-border/50 focus:border-primary"
                    disabled={isAnalyzing}
                  />
                  <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
                <Button
                  size="lg"
                  variant="hero"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="h-14 px-8"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>

              {/* Example */}
              <div className="pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground text-center">
                  Try an example:{" "}
                  <button
                    onClick={() => setRepoUrl("https://github.com/facebook/react")}
                    className="text-primary hover:text-primary-glow font-mono transition-colors"
                    disabled={isAnalyzing}
                  >
                    facebook/react
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
