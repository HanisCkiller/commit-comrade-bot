import { Hero } from "@/components/Hero";
import { RepoInput } from "@/components/RepoInput";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <RepoInput />
      <Features />
      <HowItWorks />
    </main>
  );
};

export default Index;
