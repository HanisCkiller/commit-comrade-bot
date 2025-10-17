import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Submit Repository",
    description: "Paste your GitHub repository URL into CodeSensei's input field.",
  },
  {
    number: "02",
    title: "Agent Analysis",
    description: "Multiple AI agents collaborate to analyze code structure, patterns, and dependencies.",
  },
  {
    number: "03",
    title: "Tutorial Generation",
    description: "AI synthesizes findings into a comprehensive, easy-to-follow learning guide.",
  },
  {
    number: "04",
    title: "Learn & Build",
    description: "Follow your personalized tutorial to master the codebase and start contributing.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From repository to tutorial in four simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect">
                      <span className="text-2xl font-bold font-mono">{step.number}</span>
                    </div>
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group">
                  <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (except last) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -bottom-4 left-10 text-primary/30">
                    <ArrowRight className="w-6 h-6 rotate-90" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
