import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Target, BookOpen, Code, Sparkles, Trophy, Clock, GraduationCap, Terminal, FileCode, GitBranch, Edit, Wrench, AlertCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface LearningJourneyData {
  project_title: string;
  overview: string;
  difficulty_level: string;
  estimated_duration: string;
  prerequisites: string[];
  glossary: GlossaryTerm[];
  learning_path: LearningStage[];
}

interface GlossaryTerm {
  term: string;
  explain_like_im_5: string;
  when_to_use: string;
  common_pitfall: string;
}

interface LearningStage {
  stage: string;
  goal: string;
  concepts: string[];
  steps: LearningStep[];
  checkpoint?: string;
  quiz?: QuizQuestion[];
  mini_challenge?: string;
  final_challenge?: string;
}

interface LearningStep {
  title: string;
  type: 'command' | 'code_reading' | 'trace' | 'code_mod' | 'scaffold';
  commands?: string[];
  file_path?: string;
  snippet?: string;
  explanation?: string;
  why?: string;
  check_yourself?: string;
  why_it_matters?: string;
  edges?: Array<{ from: string; to: string; why: string }>;
  diff?: string;
  file_path_suggestion?: string;
  skeleton_code?: string;
  verify?: {
    method: string;
    expect?: string[];
    url_hint?: string;
    fallback_tip?: string;
  };
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  why?: string;
}

interface LearningJourneyProps {
  data: LearningJourneyData;
}

export const LearningJourney = ({ data }: LearningJourneyProps) => {
  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'advanced': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'command': return <Terminal className="w-5 h-5 text-primary" />;
      case 'code_reading': return <FileCode className="w-5 h-5 text-primary" />;
      case 'trace': return <GitBranch className="w-5 h-5 text-primary" />;
      case 'code_mod': return <Edit className="w-5 h-5 text-primary" />;
      case 'scaffold': return <Wrench className="w-5 h-5 text-primary" />;
      default: return <Code className="w-5 h-5 text-primary" />;
    }
  };

  const renderStep = (step: LearningStep, idx: number) => {
    return (
      <Card key={idx} className="p-4 bg-secondary/20 border-secondary/30">
        <div className="flex items-start gap-3 mb-3">
          {getStepIcon(step.type)}
          <div className="flex-1">
            <h5 className="font-semibold text-foreground">{step.title}</h5>
            <Badge variant="outline" className="mt-1 text-xs">{step.type}</Badge>
          </div>
        </div>

        {/* Commands */}
        {step.commands && step.commands.length > 0 && (
          <div className="mt-3 p-3 bg-black/50 rounded-lg border border-primary/20">
            <code className="text-sm text-green-400 font-mono">
              {step.commands.map((cmd, i) => (
                <div key={i}>$ {cmd}</div>
              ))}
            </code>
          </div>
        )}

        {/* File Path */}
        {step.file_path && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-1">File:</p>
            <code className="text-sm text-primary font-mono bg-primary/10 px-2 py-1 rounded">
              {step.file_path}
            </code>
          </div>
        )}

        {/* Snippet */}
        {step.snippet && (
          <div className="mt-3 p-3 bg-black/50 rounded-lg border border-primary/20 overflow-x-auto">
            <pre className="text-xs text-gray-300 font-mono whitespace-pre">{step.snippet}</pre>
          </div>
        )}

        {/* Explanation */}
        {step.explanation && (
          <p className="mt-3 text-sm text-muted-foreground">{step.explanation}</p>
        )}

        {/* Why */}
        {step.why && (
          <div className="mt-3 p-2 bg-primary/5 rounded border-l-2 border-primary">
            <p className="text-sm text-muted-foreground"><strong className="text-foreground">Why:</strong> {step.why}</p>
          </div>
        )}

        {/* Check Yourself */}
        {step.check_yourself && (
          <div className="mt-3 p-2 bg-accent/5 rounded border-l-2 border-accent">
            <p className="text-sm text-muted-foreground"><strong className="text-foreground">Check yourself:</strong> {step.check_yourself}</p>
          </div>
        )}

        {/* Why It Matters */}
        {step.why_it_matters && (
          <div className="mt-3 p-2 bg-secondary/30 rounded">
            <p className="text-sm text-muted-foreground"><strong className="text-foreground">Why it matters:</strong> {step.why_it_matters}</p>
          </div>
        )}

        {/* Trace Edges */}
        {step.edges && step.edges.length > 0 && (
          <div className="mt-3 space-y-2">
            {step.edges.map((edge, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <code className="text-primary font-mono text-xs">{edge.from}</code>
                <span className="text-muted-foreground">→</span>
                <code className="text-primary font-mono text-xs">{edge.to}</code>
                <span className="text-xs text-muted-foreground">({edge.why})</span>
              </div>
            ))}
          </div>
        )}

        {/* Diff */}
        {step.diff && (
          <div className="mt-3 p-3 bg-black/50 rounded-lg border border-accent/20">
            <pre className="text-xs font-mono whitespace-pre">{step.diff}</pre>
          </div>
        )}

        {/* Skeleton Code */}
        {step.skeleton_code && (
          <div className="mt-3 p-3 bg-black/50 rounded-lg border border-primary/20 overflow-x-auto">
            <pre className="text-xs text-gray-300 font-mono whitespace-pre">{step.skeleton_code}</pre>
          </div>
        )}

        {/* File Path Suggestion */}
        {step.file_path_suggestion && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-1">Suggested path:</p>
            <code className="text-sm text-accent font-mono bg-accent/10 px-2 py-1 rounded">
              {step.file_path_suggestion}
            </code>
          </div>
        )}

        {/* Verify */}
        {step.verify && (
          <div className="mt-3 p-3 bg-green-500/10 rounded border border-green-500/20">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-green-400 mb-1">Verify ({step.verify.method})</p>
                {step.verify.expect && (
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {step.verify.expect.map((exp, i) => (
                      <li key={i}>• {exp}</li>
                    ))}
                  </ul>
                )}
                {step.verify.url_hint && (
                  <p className="text-xs text-muted-foreground mt-1">URL: {step.verify.url_hint}</p>
                )}
                {step.verify.fallback_tip && (
                  <div className="mt-2 p-2 bg-orange-500/10 rounded border border-orange-500/20">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-3 h-3 text-orange-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-orange-300">{step.verify.fallback_tip}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text">{data.project_title}</h1>
            <p className="text-muted-foreground mt-1">Your Interactive Learning Journey</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Badge className={getDifficultyColor(data.difficulty_level)}>
            {data.difficulty_level}
          </Badge>
          <Badge variant="outline" className="gap-2">
            <Clock className="w-3 h-3" />
            {data.estimated_duration}
          </Badge>
        </div>
      </div>

      {/* Overview */}
      <Card className="p-6 border-primary/20 bg-primary/5">
        <div className="flex items-start gap-4">
          <Target className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-semibold mb-2 text-foreground">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">{data.overview}</p>
          </div>
        </div>
      </Card>

      {/* Prerequisites & Glossary Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Prerequisites */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
            <BookOpen className="w-5 h-5 text-primary" />
            Prerequisites
          </h3>
          <ul className="space-y-2">
            {data.prerequisites.map((prereq, idx) => (
              <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{prereq}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Glossary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
            <Sparkles className="w-5 h-5 text-primary" />
            Glossary
          </h3>
          <Accordion type="single" collapsible className="space-y-2">
            {data.glossary.map((term, idx) => (
              <AccordionItem key={idx} value={`term-${idx}`} className="border border-secondary/30 rounded-lg px-3">
                <AccordionTrigger className="py-2 hover:no-underline">
                  <span className="text-sm font-semibold text-primary">{term.term}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="font-semibold text-foreground">ELI5:</p>
                      <p className="text-muted-foreground">{term.explain_like_im_5}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">When to use:</p>
                      <p className="text-muted-foreground">{term.when_to_use}</p>
                    </div>
                    <div className="p-2 bg-orange-500/10 rounded border border-orange-500/20">
                      <p className="font-semibold text-orange-400">Common pitfall:</p>
                      <p className="text-orange-300">{term.common_pitfall}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>

      {/* Learning Path */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
          <Code className="w-6 h-6" />
          Learning Path
        </h2>

        <Accordion type="single" collapsible className="space-y-4">
          {data.learning_path.map((stage, idx) => (
            <AccordionItem key={idx} value={`stage-${idx}`} className="border-none">
              <Card className="overflow-hidden border-primary/20 hover:border-primary/40 transition-colors">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-4 text-left">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary font-bold border border-primary/30 flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{stage.stage}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{stage.goal}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6 mt-4">
                    {/* Concepts */}
                    <div>
                      <h4 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Key Concepts
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {stage.concepts.map((concept, i) => (
                          <Badge key={i} variant="outline" className="bg-secondary/50">
                            {concept}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-foreground">Steps</h4>
                      {stage.steps.map((step, i) => renderStep(step, i))}
                    </div>

                    {/* Checkpoint */}
                    {stage.checkpoint && (
                      <Card className="p-4 bg-primary/5 border-primary/20">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-semibold mb-1 text-foreground">Checkpoint</h4>
                            <p className="text-sm text-muted-foreground">{stage.checkpoint}</p>
                          </div>
                        </div>
                      </Card>
                    )}

                    {/* Quiz */}
                    {stage.quiz && stage.quiz.length > 0 && (
                      <Card className="p-4 bg-secondary/30 border-secondary">
                        <h4 className="text-sm font-semibold mb-3 text-foreground">Quick Quiz</h4>
                        {stage.quiz.map((q, i) => (
                          <div key={i} className="space-y-2">
                            <p className="text-sm font-medium text-foreground">{q.question}</p>
                            <ul className="space-y-1 ml-4">
                              {q.options.map((option, j) => (
                                <li key={j} className="text-sm text-muted-foreground">
                                  • {option}
                                </li>
                              ))}
                            </ul>
                            <div className="mt-2 p-2 bg-primary/10 rounded">
                              <p className="text-xs text-primary font-semibold">Answer: {q.answer}</p>
                              {q.why && <p className="text-xs text-muted-foreground mt-1">{q.why}</p>}
                            </div>
                          </div>
                        ))}
                      </Card>
                    )}

                    {/* Challenges */}
                    {(stage.mini_challenge || stage.final_challenge) && (
                      <Card className="p-4 bg-accent/5 border-accent/20">
                        <div className="flex items-start gap-3">
                          <Trophy className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-semibold mb-1 text-foreground">
                              {stage.final_challenge ? 'Final Challenge' : 'Mini Challenge'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {stage.mini_challenge || stage.final_challenge}
                            </p>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
