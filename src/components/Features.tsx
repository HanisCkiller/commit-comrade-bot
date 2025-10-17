import { Brain, GitBranch, BookOpen, Zap, Shield, Sparkles } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Multi-Agent Analysis",
    description: "Powered by advanced A2A (Agent-to-Agent) architecture, multiple specialized AI agents collaborate to understand your codebase from different angles.",
  },
  {
    icon: GitBranch,
    title: "Deep Code Understanding",
    description: "Analyzes repository structure, dependencies, design patterns, and relationships between components to create accurate documentation.",
  },
  {
    icon: BookOpen,
    title: "Structured Tutorials",
    description: "Generates comprehensive, step-by-step tutorials with clear explanations, code examples, and best practices.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get your tutorial in minutes, not hours. Our optimized agent system processes even large codebases efficiently.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your code is analyzed securely and never stored. We respect your intellectual property and data privacy.",
  },
  {
    icon: Sparkles,
    title: "MCP Integration",
    description: "Leverages Model Context Protocol for seamless agent communication and enhanced understanding capabilities.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Powered by <span className="gradient-text">Advanced AI</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            CodeSensei uses cutting-edge multi-agent architecture to deliver 
            comprehensive code analysis and tutorials
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Content */}
                <div className="relative space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
