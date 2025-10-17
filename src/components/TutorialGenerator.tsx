import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Github, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const TutorialGenerator = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [tutorial, setTutorial] = useState("");

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
    
    // Mock tutorial generation (will be replaced with actual multi-agent system)
    setTimeout(() => {
      const mockTutorial = `# Tutorial: Understanding ${repoUrl.split('/').pop()}

## Overview
This repository contains a well-structured codebase that demonstrates several key concepts.

## Architecture
The project follows a modular architecture with clear separation of concerns:

- **Components**: Reusable UI elements
- **Services**: Business logic and API interactions
- **Utils**: Helper functions and utilities

## Key Features
1. **Feature One**: Description of the first major feature
2. **Feature Two**: Description of the second major feature
3. **Feature Three**: Description of the third major feature

## Code Structure
\`\`\`
src/
├── components/
├── services/
├── utils/
└── index.js
\`\`\`

## Getting Started
To work with this codebase:

1. Clone the repository
2. Install dependencies
3. Start the development server

## Best Practices
- Follow the existing code style
- Write comprehensive tests
- Document your changes

*Note: This is a placeholder tutorial. The actual multi-agent analysis will be implemented in the next steps.*
`;
      
      setTutorial(mockTutorial);
      setIsGenerating(false);
      toast.success("Tutorial generated successfully!");
    }, 2500);
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
                    <FileText className="w-4 h-4" />
                    Generate Tutorial
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Example Link */}
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Try example:{" "}
              <button
                onClick={() => setRepoUrl("https://github.com/facebook/react")}
                className="text-primary hover:text-primary-glow font-mono transition-colors underline"
                disabled={isGenerating}
              >
                facebook/react
              </button>
            </p>
          </div>
        </div>
      </Card>

      {/* Tutorial Output */}
      {tutorial && (
        <Card className="p-6 bg-card border-border">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b border-border">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Generated Tutorial</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4 gradient-text" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-8 mb-3 text-foreground" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground" {...props} />,
                  p: ({node, ...props}) => <p className="text-muted-foreground mb-4 leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-4 text-muted-foreground" {...props} />,
                  li: ({node, ...props}) => <li className="ml-4" {...props} />,
                  code: ({node, inline, ...props}: any) => 
                    inline ? (
                      <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-sm" {...props} />
                    ) : (
                      <code className="block p-4 rounded-lg bg-secondary/50 border border-border font-mono text-sm overflow-x-auto" {...props} />
                    ),
                  pre: ({node, ...props}) => <pre className="mb-4" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                  em: ({node, ...props}) => <em className="italic text-foreground" {...props} />,
                }}
              >
                {tutorial}
              </ReactMarkdown>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
