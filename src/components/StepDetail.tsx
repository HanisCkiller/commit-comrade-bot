import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Code2, TestTube, Lightbulb, Target } from "lucide-react";
import type { Step } from "./StepByStepLearning";

interface StepDetailProps {
  step: Step;
  onBack: () => void;
}

export const StepDetail = ({ step, onBack }: StepDetailProps) => {
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

  return (
    <div className="space-y-6">
      <Button
        onClick={onBack}
        variant="outline"
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to All Steps
      </Button>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary font-bold">
                {step.number}
              </div>
              <div>
                <CardTitle className="text-2xl">{step.title}</CardTitle>
                <p className="text-muted-foreground mt-1">{step.description}</p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`${getDifficultyColor(step.difficulty)} uppercase text-xs font-semibold px-3 shrink-0`}
            >
              {step.difficulty.replace("-", " ")}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Task Instructions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Target className="h-5 w-5" />
              <h3 className="font-semibold text-lg text-foreground">Your Task</h3>
            </div>
            <Card className="bg-muted/30 border-border/50">
              <CardContent className="pt-6">
                <p className="text-foreground leading-relaxed">{step.detail.task}</p>
              </CardContent>
            </Card>
          </div>

          {/* Expected Result */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-500">
              <CheckCircle2 className="h-5 w-5" />
              <h3 className="font-semibold text-lg text-foreground">Expected Result</h3>
            </div>
            <Card className="bg-emerald-500/5 border-emerald-500/20">
              <CardContent className="pt-6">
                <p className="text-foreground leading-relaxed">{step.detail.expectedResult}</p>
              </CardContent>
            </Card>
          </div>

          {/* Code Example */}
          {step.detail.codeExample && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-accent">
                <Code2 className="h-5 w-5" />
                <h3 className="font-semibold text-lg text-foreground">Code Example</h3>
              </div>
              <Card className="bg-background border-border/50">
                <CardContent className="pt-6">
                  <pre className="text-sm overflow-x-auto">
                    <code className="text-muted-foreground">{step.detail.codeExample}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Test Case */}
          {step.detail.testCase && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-500">
                <TestTube className="h-5 w-5" />
                <h3 className="font-semibold text-lg text-foreground">Test Case</h3>
              </div>
              <Card className="bg-amber-500/5 border-amber-500/20">
                <CardContent className="pt-6">
                  <pre className="text-sm overflow-x-auto">
                    <code className="text-foreground">{step.detail.testCase}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tips */}
          {step.detail.tips && step.detail.tips.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Lightbulb className="h-5 w-5" />
                <h3 className="font-semibold text-lg text-foreground">Tips & Best Practices</h3>
              </div>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    {step.detail.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1 shrink-0">•</span>
                        <span className="text-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="pt-4 flex justify-between items-center">
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Steps
            </Button>
            {step.number < 5 && (
              <Button onClick={onBack} variant="hero">
                Next Step
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
