import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Target, BookOpen, Code, Sparkles, Trophy, Clock, GraduationCap } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface LearningJourneyData {
  project_title: string;
  overview: string;
  difficulty_level: string;
  estimated_duration: string;
  prerequisites: string[];
  learning_objectives: string[];
  learning_path: LearningStage[];
  final_project: {
    goal: string;
    description: string;
    expected_learning: string[];
  };
}

interface LearningStage {
  stage: string;
  goal: string;
  concepts: string[];
  steps: string[];
  checkpoint: string;
  quiz?: QuizQuestion[];
  mini_challenge?: string;
  final_challenge?: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
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

      {/* Prerequisites & Objectives Grid */}
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

        {/* Learning Objectives */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
            <Target className="w-5 h-5 text-primary" />
            Learning Objectives
          </h3>
          <ul className="space-y-2">
            {data.learning_objectives.map((objective, idx) => (
              <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{objective}</span>
              </li>
            ))}
          </ul>
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
                    <div>
                      <h4 className="text-sm font-semibold mb-3 text-foreground">Steps</h4>
                      <ol className="space-y-2">
                        {stage.steps.map((step, i) => (
                          <li key={i} className="flex gap-3 text-muted-foreground">
                            <span className="text-primary font-semibold flex-shrink-0">{i + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Checkpoint */}
                    <Card className="p-4 bg-primary/5 border-primary/20">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold mb-1 text-foreground">Checkpoint</h4>
                          <p className="text-sm text-muted-foreground">{stage.checkpoint}</p>
                        </div>
                      </div>
                    </Card>

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
                            <p className="text-xs text-primary/70 mt-2">Answer: {q.answer}</p>
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

      {/* Final Project */}
      <Card className="p-6 border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-accent/20 border border-accent/30">
            <Trophy className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2 gradient-text">{data.final_project.goal}</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">{data.final_project.description}</p>
            
            <h3 className="text-sm font-semibold mb-2 text-foreground">Expected Learning Outcomes</h3>
            <ul className="space-y-2">
              {data.final_project.expected_learning.map((outcome, idx) => (
                <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                  <Sparkles className="w-4 h-4 text-accent flex-shrink-0" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
