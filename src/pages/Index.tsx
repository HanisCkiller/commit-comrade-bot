import { Header } from "@/components/Header";
import { TutorialGenerator } from "@/components/TutorialGenerator";
import { StepByStepLearning } from "@/components/StepByStepLearning";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="text-center space-y-3 py-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Master Any <span className="gradient-text">Codebase</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Paste a GitHub repository URL and let our AI analyze the code to generate 
              a comprehensive tutorial tailored for learning.
            </p>
          </div>

          {/* Main Content with Tabs */}
          <Tabs defaultValue="example" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="example">Example Project</TabsTrigger>
              <TabsTrigger value="generate">Generate Tutorial</TabsTrigger>
            </TabsList>
            
            <TabsContent value="example" className="mt-6">
              <StepByStepLearning />
            </TabsContent>
            
            <TabsContent value="generate" className="mt-6">
              <TutorialGenerator />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
