import { Code2, Sparkles } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
            <Code2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
              CodeSensei
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            </h1>
            <p className="text-sm text-muted-foreground">Turn Any Repo Into a Skill</p>
          </div>
        </div>
      </div>
    </header>
  );
};
