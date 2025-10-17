import type { AgentConfig, AgentResponse, RepoSnapshot } from '@/types/agents';

/**
 * CodeAnalyzer Agent
 * Analyzes repository structure and extracts tech stack, modules, and key files
 */
class CodeAnalyzerAgent {
  private config: AgentConfig = {
    name: 'CodeAnalyzer',
    role: 'Analyze repository structure and content',
    systemPrompt: `You are CodeAnalyzer.
Given a JSON repo snapshot, analyze the project structure.
Identify:
- The tech stack (frontend/backend/frameworks)
- Core modules and their purpose
- Key files and what they do
Return a JSON summary for the next Agent.`,
  };

  getConfig(): AgentConfig {
    return this.config;
  }

  /**
   * Analyze repository data and extract structured information
   */
  async analyzeRepo(repoSnapshot: RepoSnapshot): Promise<AgentResponse> {
    console.log('[CodeAnalyzer] Starting repository analysis...');

    try {
      const analysis = this.performAnalysis(repoSnapshot);

      console.log('[CodeAnalyzer] Analysis completed successfully');
      return {
        success: true,
        data: analysis,
        agentName: this.config.name,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[CodeAnalyzer] Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        agentName: this.config.name,
      };
    }
  }

  /**
   * Perform analysis on the repository snapshot
   */
  private performAnalysis(repoSnapshot: RepoSnapshot): {
    tech_stack: string[];
    core_modules: Array<{ name: string; purpose: string }>;
    important_files: Array<{ file: string; description: string }>;
    summary: string;
  } {
    const { readme, fileTree, keyFiles, metadata } = repoSnapshot;

    // Analyze tech stack
    const tech_stack = this.detectTechStack(fileTree, keyFiles, readme);

    // Identify core modules
    const core_modules = this.identifyCoreModules(fileTree, keyFiles);

    // Find important files
    const important_files = this.findImportantFiles(fileTree, keyFiles);

    // Generate summary
    const summary = this.generateSummary(metadata, tech_stack, core_modules);

    return {
      tech_stack,
      core_modules,
      important_files,
      summary,
    };
  }

  /**
   * Detect technology stack from file patterns and content
   */
  private detectTechStack(
    fileTree?: string[],
    keyFiles?: Record<string, string>,
    readme?: string
  ): string[] {
    const techStack = new Set<string>();

    // Check for common files and patterns
    const fileTreeStr = fileTree?.join(' ').toLowerCase() || '';
    const keyFilesStr = JSON.stringify(keyFiles || {}).toLowerCase();
    const readmeStr = readme?.toLowerCase() || '';

    const allContent = `${fileTreeStr} ${keyFilesStr} ${readmeStr}`;

    // Frontend frameworks
    if (allContent.includes('react') || allContent.includes('.jsx') || allContent.includes('.tsx')) {
      techStack.add('React');
    }
    if (allContent.includes('vue')) techStack.add('Vue.js');
    if (allContent.includes('angular')) techStack.add('Angular');
    if (allContent.includes('svelte')) techStack.add('Svelte');
    if (allContent.includes('next')) techStack.add('Next.js');

    // Backend frameworks
    if (allContent.includes('express')) techStack.add('Express.js');
    if (allContent.includes('django')) techStack.add('Django');
    if (allContent.includes('flask')) techStack.add('Flask');
    if (allContent.includes('rails')) techStack.add('Ruby on Rails');
    if (allContent.includes('spring')) techStack.add('Spring Boot');

    // Languages
    if (allContent.includes('.ts') || allContent.includes('typescript')) {
      techStack.add('TypeScript');
    }
    if (allContent.includes('.js') || allContent.includes('javascript')) {
      techStack.add('JavaScript');
    }
    if (allContent.includes('.py') || allContent.includes('python')) {
      techStack.add('Python');
    }
    if (allContent.includes('.java')) techStack.add('Java');
    if (allContent.includes('.go')) techStack.add('Go');
    if (allContent.includes('.rb') || allContent.includes('ruby')) {
      techStack.add('Ruby');
    }

    // Build tools
    if (allContent.includes('webpack')) techStack.add('Webpack');
    if (allContent.includes('vite')) techStack.add('Vite');
    if (allContent.includes('rollup')) techStack.add('Rollup');

    // Databases
    if (allContent.includes('postgres') || allContent.includes('postgresql')) {
      techStack.add('PostgreSQL');
    }
    if (allContent.includes('mongo')) techStack.add('MongoDB');
    if (allContent.includes('mysql')) techStack.add('MySQL');
    if (allContent.includes('redis')) techStack.add('Redis');

    // Testing
    if (allContent.includes('jest')) techStack.add('Jest');
    if (allContent.includes('pytest')) techStack.add('Pytest');
    if (allContent.includes('mocha')) techStack.add('Mocha');

    return Array.from(techStack);
  }

  /**
   * Identify core modules based on directory structure
   */
  private identifyCoreModules(
    fileTree?: string[],
    keyFiles?: Record<string, string>
  ): Array<{ name: string; purpose: string }> {
    const modules: Array<{ name: string; purpose: string }> = [];

    if (!fileTree) return modules;

    // Common module patterns
    const modulePatterns = {
      'src/components': 'UI Components',
      'components': 'UI Components',
      'src/services': 'Business Logic Services',
      'services': 'Business Logic Services',
      'src/utils': 'Utility Functions',
      'utils': 'Utility Functions',
      'src/api': 'API Integration',
      'api': 'API Layer',
      'src/models': 'Data Models',
      'models': 'Data Models',
      'src/controllers': 'Request Controllers',
      'controllers': 'Request Controllers',
      'src/views': 'View Templates',
      'views': 'View Templates',
      'src/store': 'State Management',
      'store': 'State Management',
      'src/hooks': 'Custom React Hooks',
      'hooks': 'Custom Hooks',
      'src/pages': 'Application Pages',
      'pages': 'Application Pages',
      'tests': 'Test Suite',
      'test': 'Test Suite',
    };

    for (const [pattern, purpose] of Object.entries(modulePatterns)) {
      const hasModule = fileTree.some(file => file.includes(pattern));
      if (hasModule) {
        modules.push({ name: pattern, purpose });
      }
    }

    return modules;
  }

  /**
   * Find and describe important files
   */
  private findImportantFiles(
    fileTree?: string[],
    keyFiles?: Record<string, string>
  ): Array<{ file: string; description: string }> {
    const importantFiles: Array<{ file: string; description: string }> = [];

    if (!fileTree) return importantFiles;

    const importantPatterns: Record<string, string> = {
      'package.json': 'NPM package configuration and dependencies',
      'requirements.txt': 'Python dependencies',
      'Dockerfile': 'Docker container configuration',
      'docker-compose.yml': 'Docker compose orchestration',
      '.env': 'Environment variables',
      'config': 'Configuration files',
      'tsconfig.json': 'TypeScript configuration',
      'webpack.config': 'Webpack bundler configuration',
      'vite.config': 'Vite build configuration',
      'README.md': 'Project documentation',
      'index.html': 'Main HTML entry point',
      'main.': 'Application entry point',
      'app.': 'Main application file',
      'server.': 'Server entry point',
    };

    for (const file of fileTree) {
      for (const [pattern, description] of Object.entries(importantPatterns)) {
        if (file.toLowerCase().includes(pattern.toLowerCase())) {
          importantFiles.push({ file, description });
          break;
        }
      }
    }

    return importantFiles.slice(0, 10); // Limit to top 10
  }

  /**
   * Generate a summary of the repository
   */
  private generateSummary(
    metadata?: RepoSnapshot['metadata'],
    tech_stack?: string[],
    core_modules?: Array<{ name: string; purpose: string }>
  ): string {
    let summary = '';

    if (metadata) {
      summary += `${metadata.name} is a ${metadata.language || 'software'} project`;
      if (metadata.description) {
        summary += `: ${metadata.description}`;
      }
      summary += '. ';
    }

    if (tech_stack && tech_stack.length > 0) {
      summary += `The project uses ${tech_stack.slice(0, 5).join(', ')}. `;
    }

    if (core_modules && core_modules.length > 0) {
      summary += `Key modules include ${core_modules
        .slice(0, 3)
        .map(m => m.name)
        .join(', ')}. `;
    }

    return summary || 'Repository analysis completed.';
  }
}

// Export singleton instance
export const codeAnalyzerAgent = new CodeAnalyzerAgent();
