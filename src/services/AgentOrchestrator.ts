import { repoCrawlerAgent } from './agents/RepoCrawlerAgent';
import { codeAnalyzerAgent } from './agents/CodeAnalyzerAgent';
import { teacherAgent } from './agents/TeacherAgent';
import type { AgentResponse } from '@/types/agents';

/**
 * AgentOrchestrator coordinates multiple AI agents to process repository data
 * and generate comprehensive tutorials
 */
export class AgentOrchestrator {
  private agents: {
    repoCrawler: typeof repoCrawlerAgent;
    codeAnalyzer: typeof codeAnalyzerAgent;
    teacher: typeof teacherAgent;
  };

  constructor() {
    this.agents = {
      repoCrawler: repoCrawlerAgent,
      codeAnalyzer: codeAnalyzerAgent,
      teacher: teacherAgent,
    };
  }

  /**
   * Execute the full multi-agent workflow to generate a tutorial
   */
  async generateTutorial(repoUrl: string): Promise<{
    success: boolean;
    tutorial?: string;
    error?: string;
    agentResults?: Record<string, AgentResponse>;
  }> {
    console.log('[Orchestrator] Starting multi-agent tutorial generation');
    const agentResults: Record<string, AgentResponse> = {};

    try {
      // Step 1: RepoCrawler fetches repository data
      console.log('[Orchestrator] Step 1: Fetching repository data...');
      const crawlerResult = await this.agents.repoCrawler.fetchRepoData(repoUrl);
      agentResults['repoCrawler'] = crawlerResult;

      if (!crawlerResult.success) {
        throw new Error(`RepoCrawler failed: ${crawlerResult.error}`);
      }

      console.log('[Orchestrator] RepoCrawler completed successfully');

      // Step 2: CodeAnalyzer agent processes the data
      console.log('[Orchestrator] Step 2: Analyzing repository structure...');
      const analyzerResult = await this.agents.codeAnalyzer.analyzeRepo(crawlerResult.data);
      agentResults['codeAnalyzer'] = analyzerResult;

      if (!analyzerResult.success) {
        throw new Error(`CodeAnalyzer failed: ${analyzerResult.error}`);
      }

      console.log('[Orchestrator] CodeAnalyzer completed successfully');

      // Step 3: Teacher agent generates the tutorial
      console.log('[Orchestrator] Step 3: Generating educational tutorial...');
      const teacherResult = await this.agents.teacher.generateTutorial(
        crawlerResult.data,
        analyzerResult.data
      );
      agentResults['teacher'] = teacherResult;

      if (!teacherResult.success) {
        throw new Error(`Teacher failed: ${teacherResult.error}`);
      }

      console.log('[Orchestrator] Teacher completed successfully');

      const tutorial = teacherResult.data;

      return {
        success: true,
        tutorial,
        agentResults,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Orchestrator] Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        agentResults,
      };
    }
  }


  /**
   * Get status of all agents
   */
  getAgentsStatus(): Record<string, { name: string; role: string; status: string }> {
    return {
      repoCrawler: {
        name: this.agents.repoCrawler.getConfig().name,
        role: this.agents.repoCrawler.getConfig().role,
        status: 'active',
      },
      codeAnalyzer: {
        name: this.agents.codeAnalyzer.getConfig().name,
        role: this.agents.codeAnalyzer.getConfig().role,
        status: 'active',
      },
      teacher: {
        name: this.agents.teacher.getConfig().name,
        role: this.agents.teacher.getConfig().role,
        status: 'active',
      },
    };
  }
}

// Export singleton instance
export const agentOrchestrator = new AgentOrchestrator();
