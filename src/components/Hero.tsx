import { Button } from "@/components/ui/button";
import { Github, Sparkles, Code2 } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-card/50 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">Powered by Multi-Agent AI System</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Master Any Codebase with{" "}
            <span className="gradient-text">AI-Generated</span>
            <br />
            Tutorials
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Paste a GitHub repository URL and watch as CodeSensei automatically analyzes 
            the code and creates comprehensive, easy-to-follow learning guides.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              variant="hero" 
              className="text-lg px-8 py-6 h-auto"
            >
              <Github className="w-5 h-5" />
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline-hero" 
              className="text-lg px-8 py-6 h-auto"
            >
              <Code2 className="w-5 h-5" />
              See How It Works
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 justify-center pt-8">
            {[
              "Multi-Agent Analysis",
              "Step-by-Step Tutorials",
              "Code Structure Breakdown",
              "Best Practices Included"
            ].map((feature) => (
              <div
                key={feature}
                className="px-4 py-2 rounded-lg bg-secondary/50 backdrop-blur-sm border border-border text-sm"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0" />
    </section>
  );
};
