import type { AgentConfig, AgentResponse, RepoSnapshot } from '@/types/agents';

/**
 * CodeAnalyzer Agent
 * Analyzes repository structure and extracts tech stack, modules, and key files
 */
class CodeAnalyzerAgent {
  private config: AgentConfig = {
    name: 'CodeAnalyzer',
    role: 'Analyze repository structure and content',
    systemPrompt: `You are CodeAnalyzerAgent 🧩.
You analyze a repository snapshot to extract architecture and data flow.
Input: RepoCrawler JSON.
Output: JSON with technical structure, not prose.

Schema:
{
  "repo_name": "string",
  "package_manager": "string",
  "entry_points": ["string"],
  "modules": [
    {"name":"string","files":["..."],"purpose":"string","key_symbols":["..."]}
  ],
  "data_flow_edges":[{"from":"fileA","to":"fileB","why":"reason"}],
  "explain_terms":[{"term":"npm","definition":"..."}],
  "ground_truth_paths":["..."]
}

Rules:
- Detect package manager (npm/yarn/pip/poetry).
- Parse imports to build data_flow_edges.
- Group files into modules.
- Add 3–5 key concepts explaining how data moves through the app.
- Output strictly JSON. No markdown.`,
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
   * Perform analysis on the repository snapshot - New format
   */
  private performAnalysis(repoSnapshot: RepoSnapshot): any {
    const { readme, fileTree, keyFiles, metadata } = repoSnapshot;

    // Extract ground truth paths
    const ground_truth_paths = fileTree || [];

    // Detect package manager
    const package_manager = this.detectPackageManager(fileTree, keyFiles);

    // Get dev commands
    const dev_commands = this.inferDevCommands(package_manager, keyFiles);

    // Find entry points
    const entry_points = this.findEntryPoints(fileTree, keyFiles);

    // Detect main concepts
    const main_concepts = this.detectMainConcepts(fileTree, keyFiles, readme);

    // Build modules list
    const modules = this.buildModules(fileTree, keyFiles);

    // Infer data flow edges
    const data_flow_edges = this.inferDataFlowEdges(modules, entry_points);

    // Generate term explanations
    const explain_terms = this.generateTermExplanations(package_manager, main_concepts);

    return {
      repo_name: metadata?.name || 'unknown/repo',
      package_manager,
      dev_commands,
      entry_points,
      main_concepts,
      modules,
      data_flow_edges,
      explain_terms,
      ground_truth_paths,
    };
  }

  /**
   * Detect package manager from files
   */
  private detectPackageManager(fileTree?: string[], keyFiles?: Record<string, string>): string {
    if (!fileTree) return 'unknown';

    const fileTreeStr = fileTree.join(' ').toLowerCase();
    
    if (fileTreeStr.includes('package-lock.json')) return 'npm';
    if (fileTreeStr.includes('yarn.lock')) return 'yarn';
    if (fileTreeStr.includes('pnpm-lock.yaml')) return 'pnpm';
    if (fileTreeStr.includes('poetry.lock') || fileTreeStr.includes('pyproject.toml')) return 'poetry';
    if (fileTreeStr.includes('requirements.txt') || fileTreeStr.includes('pipfile')) return 'pip';
    
    return 'unknown';
  }

  /**
   * Infer development commands based on package manager
   */
  private inferDevCommands(packageManager: string, keyFiles?: Record<string, string>): {
    install: string;
    run: string;
    test: string;
  } {
    const commands = {
      npm: { install: 'npm install', run: 'npm run dev', test: 'npm test' },
      yarn: { install: 'yarn install', run: 'yarn dev', test: 'yarn test' },
      pnpm: { install: 'pnpm install', run: 'pnpm dev', test: 'pnpm test' },
      pip: { install: 'pip install -r requirements.txt', run: 'python main.py', test: 'pytest' },
      poetry: { install: 'poetry install', run: 'poetry run python main.py', test: 'poetry run pytest' },
    };

    return commands[packageManager as keyof typeof commands] || {
      install: 'unknown',
      run: 'unknown',
      test: 'unknown',
    };
  }

  /**
   * Find entry point files
   */
  private findEntryPoints(fileTree?: string[], keyFiles?: Record<string, string>): string[] {
    if (!fileTree) return [];

    const entryPatterns = [
      'index.js', 'index.ts', 'index.tsx', 'index.jsx',
      'main.js', 'main.ts', 'main.tsx', 'main.py',
      'app.js', 'app.ts', 'app.tsx', 'app.py',
      'server.js', 'server.ts',
      'src/index', 'src/main', 'src/app',
    ];

    const entries: string[] = [];
    for (const file of fileTree) {
      for (const pattern of entryPatterns) {
        if (file.toLowerCase().includes(pattern.toLowerCase())) {
          entries.push(file);
          break;
        }
      }
    }

    return entries.slice(0, 5); // Limit to top 5
  }

  /**
   * Detect main concepts from codebase
   */
  private detectMainConcepts(fileTree?: string[], keyFiles?: Record<string, string>, readme?: string): string[] {
    const concepts = new Set<string>();
    const allContent = `${fileTree?.join(' ') || ''} ${JSON.stringify(keyFiles || {})} ${readme || ''}`.toLowerCase();

    // Architecture patterns
    if (allContent.includes('ssr') || allContent.includes('server-side')) concepts.add('SSR');
    if (allContent.includes('api') || allContent.includes('endpoint')) concepts.add('REST API');
    if (allContent.includes('graphql')) concepts.add('GraphQL');
    if (allContent.includes('websocket')) concepts.add('WebSocket');
    
    // State management
    if (allContent.includes('redux') || allContent.includes('zustand') || allContent.includes('state')) {
      concepts.add('State Management');
    }
    
    // UI patterns
    if (allContent.includes('component')) concepts.add('Component-based UI');
    if (allContent.includes('routing') || allContent.includes('router')) concepts.add('Routing');
    
    // Backend patterns
    if (allContent.includes('middleware')) concepts.add('Middleware');
    if (allContent.includes('authentication') || allContent.includes('auth')) concepts.add('Authentication');
    if (allContent.includes('database') || allContent.includes('db')) concepts.add('Database');
    
    return Array.from(concepts).slice(0, 8);
  }

  /**
   * Build structured modules list
   */
  private buildModules(fileTree?: string[], keyFiles?: Record<string, string>): any[] {
    if (!fileTree) return [];

    const moduleMap = new Map<string, any>();

    // Define module patterns
    const patterns = {
      'components': { name: 'UI Components', purpose: 'Reusable UI building blocks' },
      'services': { name: 'Business Services', purpose: 'Core business logic and external integrations' },
      'utils': { name: 'Utility Functions', purpose: 'Helper functions and utilities' },
      'api': { name: 'API Layer', purpose: 'Backend API endpoints and routes' },
      'pages': { name: 'Application Pages', purpose: 'Top-level page components and views' },
      'hooks': { name: 'Custom Hooks', purpose: 'Reusable React hooks for state and side effects' },
      'models': { name: 'Data Models', purpose: 'Data structures and schemas' },
      'controllers': { name: 'Controllers', purpose: 'Request handlers and business logic' },
      'store': { name: 'State Store', purpose: 'Global state management' },
    };

    for (const [pattern, info] of Object.entries(patterns)) {
      const files = fileTree.filter(f => f.toLowerCase().includes(`/${pattern}/`) || f.toLowerCase().includes(`\\${pattern}\\`));
      
      if (files.length > 0) {
        moduleMap.set(pattern, {
          name: info.name,
          files: files.slice(0, 5), // Limit files per module
          purpose: info.purpose,
          key_symbols: this.extractKeySymbols(files, keyFiles),
        });
      }
    }

    return Array.from(moduleMap.values());
  }

  /**
   * Extract key symbols from files (functions, classes, etc.)
   */
  private extractKeySymbols(files: string[], keyFiles?: Record<string, string>): string[] {
    const symbols: string[] = [];
    
    // Simple heuristic: extract from filenames
    files.slice(0, 3).forEach(file => {
      const filename = file.split('/').pop()?.replace(/\.(ts|tsx|js|jsx|py)$/, '');
      if (filename) {
        symbols.push(filename);
      }
    });

    return symbols.slice(0, 5);
  }

  /**
   * Infer data flow edges between modules
   */
  private inferDataFlowEdges(modules: any[], entry_points: string[]): any[] {
    const edges: any[] = [];

    // Simple heuristic: entry points flow to pages, pages to components
    if (entry_points.length > 0 && modules.length > 1) {
      const entryFile = entry_points[0];
      const pagesModule = modules.find(m => m.name.toLowerCase().includes('page'));
      
      if (pagesModule && pagesModule.files.length > 0) {
        edges.push({
          from: entryFile,
          to: pagesModule.files[0],
          why: 'Entry point initializes and renders pages',
        });
      }

      const componentsModule = modules.find(m => m.name.toLowerCase().includes('component'));
      if (pagesModule && componentsModule && componentsModule.files.length > 0) {
        edges.push({
          from: pagesModule.files[0],
          to: componentsModule.files[0],
          why: 'Pages compose and render UI components',
        });
      }
    }

    return edges;
  }

  /**
   * Generate explanations for technical terms
   */
  private generateTermExplanations(packageManager: string, concepts: string[]): any[] {
    const terms: any[] = [];

    // Package manager explanations
    const pmExplanations: Record<string, string> = {
      npm: 'Node Package Manager - default package manager for Node.js projects',
      yarn: 'Fast, reliable package manager alternative to npm',
      pnpm: 'Performant npm - disk space efficient package manager',
      pip: 'Python package installer for managing Python libraries',
      poetry: 'Python dependency management and packaging tool',
    };

    if (packageManager !== 'unknown' && pmExplanations[packageManager]) {
      terms.push({
        term: packageManager,
        definition: pmExplanations[packageManager],
      });
    }

    // Concept explanations
    const conceptDefs: Record<string, string> = {
      'SSR': 'Server-Side Rendering - rendering pages on the server before sending to client',
      'REST API': 'Representational State Transfer - architectural style for web services',
      'GraphQL': 'Query language for APIs providing efficient data fetching',
      'State Management': 'Managing and synchronizing application state across components',
      'Component-based UI': 'Building UIs from reusable, self-contained components',
      'Authentication': 'Verifying user identity and managing access control',
      'Middleware': 'Software layer that processes requests between client and server',
    };

    concepts.forEach(concept => {
      if (conceptDefs[concept]) {
        terms.push({
          term: concept,
          definition: conceptDefs[concept],
        });
      }
    });

    return terms;
  }

}

// Export singleton instance
export const codeAnalyzerAgent = new CodeAnalyzerAgent();
