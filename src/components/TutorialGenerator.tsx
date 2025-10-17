import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Github, Loader2, Brain } from "lucide-react";
import { toast } from "sonner";
import { agentOrchestrator } from "@/services/AgentOrchestrator";
import { LearningJourney } from "@/components/LearningJourney";

export const TutorialGenerator = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [learningJourney, setLearningJourney] = useState<any>(null);
  const [currentAgent, setCurrentAgent] = useState<string>("");

  const handleGenerate = async () => {
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

    setIsGenerating(true);
    setLearningJourney(null);
    
    try {
      // Step 1: RepoCrawler Agent
      setCurrentAgent("RepoCrawler Agent - Fetching repository data...");
      toast.info("🧠 RepoCrawler Agent is fetching repository data");
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 2: CodeAnalyzer Agent
      setCurrentAgent("CodeAnalyzer Agent - Analyzing repository structure...");
      toast.info("📊 CodeAnalyzer Agent is analyzing the codebase");
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 3: Teacher Agent (CodeSensei)
      setCurrentAgent("CodeSensei - Crafting your learning journey...");
      toast.info("🥷 CodeSensei is creating your interactive learning path");
      
      // Use the multi-agent orchestrator
      const result = await agentOrchestrator.generateTutorial(repoUrl);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to generate learning journey");
      }
      
      // Parse JSON tutorial
      try {
        const parsedJourney = JSON.parse(result.tutorial || "{}");
        setLearningJourney(parsedJourney);
      } catch (parseError) {
        console.error("Failed to parse learning journey JSON:", parseError);
        throw new Error("Failed to parse learning journey data");
      }
      
      setCurrentAgent("");
      toast.success("✅ Learning journey created successfully!");
      
    } catch (error) {
      console.error("Error generating tutorial:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate tutorial");
      setCurrentAgent("");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="p-6 bg-card border-border">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Github className="w-4 h-4 text-primary" />
              GitHub Repository URL
            </label>
            <div className="flex gap-3">
              <Input
                type="url"
                placeholder="https://github.com/username/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                className="flex-1"
                disabled={isGenerating}
              />
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                variant="hero"
                className="px-6"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    Generate Tutorial
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Agent Status */}
          {isGenerating && currentAgent && (
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Brain className="w-5 h-5 text-primary animate-pulse" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{currentAgent}</p>
                  <div className="mt-2 h-1 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-accent animate-pulse" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Example Link */}
          {!isGenerating && (
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Try example:{" "}
                <button
                  onClick={() => setRepoUrl("https://github.com/facebook/react")}
                  className="text-primary hover:text-primary-glow font-mono transition-colors underline"
                >
                  facebook/react
                </button>
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Learning Journey Output */}
      {learningJourney && <LearningJourney data={learningJourney} />}
    </div>
  );
};
