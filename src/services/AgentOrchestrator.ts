import { repoCrawlerAgent } from './agents/RepoCrawlerAgent';
import { codeAnalyzerAgent } from './agents/CodeAnalyzerAgent';
import type { AgentResponse } from '@/types/agents';

/**
 * AgentOrchestrator coordinates multiple AI agents to process repository data
 * and generate comprehensive tutorials
 */
export class AgentOrchestrator {
  private agents: {
    repoCrawler: typeof repoCrawlerAgent;
    codeAnalyzer: typeof codeAnalyzerAgent;
    // TODO: Add writer agent
  };

  constructor() {
    this.agents = {
      repoCrawler: repoCrawlerAgent,
      codeAnalyzer: codeAnalyzerAgent,
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

      // TODO: Step 3: Writer agent generates the tutorial

      // For now, generate a tutorial from both crawler and analyzer data
      const tutorial = this.generateTutorialFromAgentData(
        crawlerResult.data,
        analyzerResult.data
      );

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
   * Generate tutorial markdown from crawler and analyzer data
   * This will be replaced by a dedicated Writer agent
   */
  private generateTutorialFromAgentData(repoData: any, analysisData: any): string {
    const { metadata, readme, fileTree, keyFiles } = repoData;

    let tutorial = `# Tutorial: ${metadata?.name || 'Repository'}\n\n`;

    // Metadata section
    if (metadata) {
      tutorial += `## Repository Overview\n\n`;
      tutorial += `**Description:** ${metadata.description}\n\n`;
      tutorial += `**Primary Language:** ${metadata.language}\n\n`;
      tutorial += `**Community:** ${metadata.stars} ⭐ | ${metadata.forks} 🍴\n\n`;
    }

    // Analysis section
    if (analysisData) {
      tutorial += `## Analysis\n\n`;
      
      if (analysisData.summary) {
        tutorial += `${analysisData.summary}\n\n`;
      }

      if (analysisData.tech_stack && analysisData.tech_stack.length > 0) {
        tutorial += `### Tech Stack\n\n`;
        analysisData.tech_stack.forEach((tech: string) => {
          tutorial += `- ${tech}\n`;
        });
        tutorial += '\n';
      }

      if (analysisData.core_modules && analysisData.core_modules.length > 0) {
        tutorial += `### Core Modules\n\n`;
        analysisData.core_modules.forEach((module: any) => {
          tutorial += `- **${module.name}**: ${module.purpose}\n`;
        });
        tutorial += '\n';
      }

      if (analysisData.important_files && analysisData.important_files.length > 0) {
        tutorial += `### Important Files\n\n`;
        analysisData.important_files.forEach((file: any) => {
          tutorial += `- \`${file.file}\`: ${file.description}\n`;
        });
        tutorial += '\n';
      }
    }

    // README section
    if (readme) {
      tutorial += `## README\n\n${readme}\n\n`;
    }

    // File structure
    if (fileTree && fileTree.length > 0) {
      tutorial += `## Project Structure\n\n`;
      tutorial += "```\n";
      tutorial += fileTree.join('\n');
      tutorial += "\n```\n\n";
    }

    // Key files
    if (keyFiles && Object.keys(keyFiles).length > 0) {
      tutorial += `## Key Files\n\n`;
      for (const [filename, content] of Object.entries(keyFiles)) {
        tutorial += `### ${filename}\n\n`;
        tutorial += "```\n";
        tutorial += content;
        tutorial += "\n```\n\n";
      }
    }

    // Agent info footer
    tutorial += `---\n\n`;
    tutorial += `*Generated by CodeSensei Multi-Agent System*\n`;
    tutorial += `- 🧠 **RepoCrawler Agent**: Repository data fetched via MCP\n`;
    tutorial += `- 📊 **CodeAnalyzer Agent**: Structure and tech stack analyzed\n`;
    tutorial += `- ✍️ **Writer Agent**: Coming soon...\n`;

    return tutorial;
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
      // TODO: Add writer agent
    };
  }
}

// Export singleton instance
export const agentOrchestrator = new AgentOrchestrator();
