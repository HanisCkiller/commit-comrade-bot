import type { AgentConfig, AgentResponse, RepoSnapshot } from '@/types/agents';

export class RepoCrawlerAgent {
  private config: AgentConfig = {
    name: 'RepoCrawler',
    role: 'Fetch repo information from backend via MCP',
    systemPrompt: `You are RepoCrawler.
When given a GitHub repo URL, call the MCP endpoint repo_snapshot(url)
to fetch and return repository metadata as JSON.`,
    mcpEndpoint: {
      name: 'repo_snapshot',
      method: 'GET',
      url: 'http://localhost:8000/repo/snapshot',
      params: {
        url: ''
      }
    }
  };

  /**
   * Fetch repository snapshot from MCP endpoint
   */
  async fetchRepoData(repoUrl: string): Promise<AgentResponse> {
    console.log(`[${this.config.name}] Starting to fetch data for: ${repoUrl}`);
    
    try {
      // Construct MCP endpoint URL with query parameter
      const mcpUrl = new URL(this.config.mcpEndpoint!.url);
      mcpUrl.searchParams.append('url', repoUrl);

      console.log(`[${this.config.name}] Calling MCP endpoint:`, mcpUrl.toString());

      // Call the MCP endpoint
      const response = await fetch(mcpUrl.toString(), {
        method: this.config.mcpEndpoint!.method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`MCP endpoint returned ${response.status}: ${response.statusText}`);
      }

      const data: RepoSnapshot = await response.json();
      
      console.log(`[${this.config.name}] Successfully fetched repo data`);

      return {
        success: true,
        data,
        agentName: this.config.name,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[${this.config.name}] Error:`, errorMessage);

      // For development: return mock data if MCP endpoint is not available
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        console.warn(`[${this.config.name}] MCP endpoint not available, using mock data`);
        return this.getMockData(repoUrl);
      }

      return {
        success: false,
        error: errorMessage,
        agentName: this.config.name,
      };
    }
  }

  /**
   * Mock data for development when MCP endpoint is not available
   */
  private getMockData(repoUrl: string): AgentResponse {
    const repoName = repoUrl.split('/').pop() || 'repository';
    
    return {
      success: true,
      data: {
        readme: '# Sample Repository\n\nThis is a mock response from RepoCrawler agent.\n\n## Features\n- Feature 1\n- Feature 2\n- Feature 3',
        fileTree: [
          'src/',
          'src/index.js',
          'src/components/',
          'src/components/App.jsx',
          'src/utils/',
          'src/utils/helpers.js',
          'package.json',
          'README.md',
          '.gitignore'
        ],
        keyFiles: {
          'package.json': JSON.stringify({
            name: repoName,
            version: '1.0.0',
            dependencies: {
              'react': '^18.0.0',
              'react-dom': '^18.0.0'
            }
          }, null, 2),
          'src/index.js': 'console.log("Hello World");'
        },
        metadata: {
          name: repoName,
          description: 'A sample repository for demonstration',
          language: 'JavaScript',
          stars: 42,
          forks: 7
        }
      } as RepoSnapshot,
      agentName: this.config.name,
    };
  }

  /**
   * Get agent configuration
   */
  getConfig(): AgentConfig {
    return this.config;
  }

  /**
   * Update MCP endpoint URL (useful for configuration)
   */
  setMCPEndpoint(url: string): void {
    if (this.config.mcpEndpoint) {
      this.config.mcpEndpoint.url = url;
    }
  }
}

// Export singleton instance
export const repoCrawlerAgent = new RepoCrawlerAgent();
