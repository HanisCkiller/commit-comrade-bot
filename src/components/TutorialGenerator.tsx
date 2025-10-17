import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Loader2, Brain, Terminal, AlertCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { agentOrchestrator } from "@/services/AgentOrchestrator";
import { StepDetail } from "@/components/StepDetail";
import type { Step } from "@/components/StepByStepLearning";

interface TutorialData {
  project_title: string;
  overview: string;
  steps: Step[];
}

export const TutorialGenerator = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [tutorialData, setTutorialData] = useState<TutorialData | null>(null);
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);
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
    setTutorialData(null);
    setSelectedStep(null);
    
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
      setCurrentAgent("CodeSensei - Crafting your step-by-step guide...");
      toast.info("🥷 CodeSensei is creating your learning path");
      
      // Use the multi-agent orchestrator
      const result = await agentOrchestrator.generateTutorial(repoUrl);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to generate tutorial");
      }
      
      // Parse JSON tutorial
      try {
        const parsed = JSON.parse(result.tutorial || "{}");
        setTutorialData(parsed);
      } catch (parseError) {
        console.error("Failed to parse tutorial JSON:", parseError);
        throw new Error("Failed to parse tutorial data");
      }
      
      setCurrentAgent("");
      toast.success("✅ Tutorial created successfully!");
      
    } catch (error) {
      console.error("Error generating tutorial:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate tutorial");
      setCurrentAgent("");
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (difficulty: Step["difficulty"]) => {
    switch (difficulty) {
      case "very-easy":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "easy":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "hard":
        return "bg-red-500/10 text-red-500 border-red-500/20";
    }
  };

  const getDifficultyBars = (difficulty: Step["difficulty"]) => {
    const bars = {
      "very-easy": 1,
      "easy": 2,
      "medium": 3,
      "hard": 4
    };
    return bars[difficulty];
  };

  if (selectedStep) {
    return (
      <StepDetail
        step={selectedStep}
        onBack={() => setSelectedStep(null)}
      />
    );
  }

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

      {/* Tutorial Output */}
      {tutorialData && (
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{tutorialData.project_title}</CardTitle>
                <CardDescription className="text-base">
                  {tutorialData.overview}
                </CardDescription>
              </div>
              <Terminal className="h-8 w-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tutorialData.steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setSelectedStep(step)}
                  className="w-full group"
                >
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3 flex-1 text-left">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                        {step.number}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {step.title}
                          </h3>
                          {step.isCritical && (
                            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Badge
                        variant="outline"
                        className={`${getDifficultyColor(step.difficulty)} uppercase text-xs font-semibold px-3`}
                      >
                        {step.difficulty.replace("-", " ")}
                        <span className="ml-2 inline-flex gap-0.5">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <span
                              key={i}
                              className={`w-1 h-3 rounded-full ${
                                i < getDifficultyBars(step.difficulty)
                                  ? "bg-current"
                                  : "bg-current/20"
                              }`}
                            />
                          ))}
                        </span>
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Steps marked with <AlertCircle className="inline h-4 w-4 text-amber-500" /> are critical
                </p>
                <p className="text-sm text-muted-foreground">
                  These steps are fundamental to understanding the project. Take extra care to complete them thoroughly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
