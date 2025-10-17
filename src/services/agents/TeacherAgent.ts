import type { AgentConfig, AgentResponse, RepoSnapshot } from '@/types/agents';

/**
 * Teacher Agent
 * Converts analyzed repository data into clear educational tutorials
 */
class TeacherAgent {
  private config: AgentConfig = {
    name: 'Teacher',
    role: 'Generate interactive learning journeys',
    systemPrompt: `You are CodeSensei 🥷, an AI mentor that teaches open-source codebases like a CodeCrafters course.

Input: CodeAnalyzerAgent JSON.
Output: a detailed, step-by-step learning curriculum in strict JSON.

Schema:
{
  "project_title": "string",
  "overview": "string",
  "difficulty_level": "beginner|intermediate|advanced",
  "estimated_duration": "e.g. 3h",
  "glossary": [{"term":"...","explain_like_im_5":"...","when_to_use":"...","common_pitfall":"..."}],
  "learning_path": [
    {
      "stage":"Stage Title",
      "goal":"...",
      "concepts":["..."],
      "steps":[
        {
          "title":"...",
          "type":"command|code_reading|code_mod|trace|scaffold",
          "file_path":".../exists/in/repo",
          "snippet":"...real code...",
          "explanation":"Explain line-by-line what happens and why.",
          "verify":{"method":"...","expect":["..."]}
        }
      ],
      "mini_challenge":"Small exercise",
      "quiz":[{"question":"...","options":["..."],"answer":"...","why":"..."}],
      "checkpoint":"What the learner should see or run"
    }
  ]
}

Guidelines:
- Use only real code from repo (never hallucinate).
- Every step must be actionable (code, command, or test).
- Focus on *why* each file/function exists.
- Add mini challenges, quizzes, and checkpoints.
- JSON only. No markdown or free text.`,
  };

  getConfig(): AgentConfig {
    return this.config;
  }

  /**
   * Generate a comprehensive tutorial from repository and analysis data
   */
  async generateTutorial(
    repoData: RepoSnapshot,
    analysisData: any
  ): Promise<AgentResponse> {
    console.log('[Teacher] Starting tutorial generation...');

    try {
      const tutorial = this.createTutorial(repoData, analysisData);

      console.log('[Teacher] Tutorial generated successfully');
      return {
        success: true,
        data: tutorial,
        agentName: this.config.name,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Teacher] Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        agentName: this.config.name,
      };
    }
  }

  /**
   * Create a step-by-step tutorial in simplified format
   */
  private createTutorial(repoData: RepoSnapshot, analysisData: any): string {
    const { metadata } = repoData;
    const { 
      repo_name, 
      package_manager, 
      dev_commands, 
      entry_points, 
      main_concepts, 
      modules
    } = analysisData;

    const projectTitle = repo_name || metadata?.name || 'Repository Learning Journey';
    const overview = `Master ${projectTitle} through hands-on learning. ${metadata?.description || 'Understand the architecture, run it locally, and build your own features.'}`;
    const steps = this.generateStepByStepPath(repoData, analysisData);

    const tutorial = {
      project_title: projectTitle,
      overview,
      steps
    };

    return JSON.stringify(tutorial, null, 2);
  }

  /**
   * Generate simplified step-by-step path
   */
  private generateStepByStepPath(repoData: RepoSnapshot, analysisData: any): any[] {
    const { dev_commands, entry_points, modules, package_manager, main_concepts } = analysisData;
    const steps: any[] = [];
    let stepNumber = 1;

    // Step 1: Setup
    steps.push({
      id: `step${stepNumber}`,
      number: stepNumber++,
      title: "Clone and Setup Environment",
      description: `Set up your local development environment using ${package_manager || 'package manager'}`,
      difficulty: "very-easy",
      isCritical: true,
      detail: {
        task: `Clone the repository and install all required dependencies using ${package_manager || 'the package manager'}.`,
        expectedResult: `You should see a successful installation message. Running the dev command should start the application.`,
        codeExample: this.generateSetupCommands(package_manager, dev_commands),
        tips: [
          `Make sure you have ${package_manager || 'the package manager'} installed`,
          "Check for any environment variables needed in .env files",
          "Verify all dependencies installed without errors"
        ]
      }
    });

    // Step 2: Understand structure
    if (entry_points && entry_points.length > 0) {
      const mainEntryPoint = entry_points[0];
      steps.push({
        id: `step${stepNumber}`,
        number: stepNumber++,
        title: "Understand the Project Structure",
        description: "Learn the architecture and main entry points",
        difficulty: "easy",
        detail: {
          task: `Explore the project structure. The main entry point is at ${mainEntryPoint}. Understand how the application bootstraps.`,
          expectedResult: "You should be able to trace the execution flow from the entry point through the main modules.",
          codeExample: this.generateFileTree(modules),
          tips: [
            `Start by reading ${mainEntryPoint}`,
            "Identify the main modules and their responsibilities",
            "Draw a simple diagram of component relationships"
          ]
        }
      });
    }

    // Step 3: Run the application
    steps.push({
      id: `step${stepNumber}`,
      number: stepNumber++,
      title: "Run the Application",
      description: "Start the development server and verify it works",
      difficulty: "easy",
      isCritical: true,
      detail: {
        task: `Run the development server using the command provided. Verify the application starts without errors.`,
        expectedResult: "The application should start successfully and be accessible in your browser or terminal.",
        codeExample: dev_commands?.run || "npm run dev",
        testCase: "Check the console output for any errors. Try accessing the application's main interface.",
        tips: [
          "Check what port the application runs on",
          "Look for startup logs to confirm successful launch",
          "Try the basic features to ensure everything works"
        ]
      }
    });

    // Step 4: Explore key modules
    if (modules && modules.length > 0) {
      const keyModule = modules[0];
      steps.push({
        id: `step${stepNumber}`,
        number: stepNumber++,
        title: `Explore ${keyModule.name || 'Core Module'}`,
        description: keyModule.purpose || "Learn how this module works",
        difficulty: "medium",
        detail: {
          task: `Study the ${keyModule.name} module. Understand its purpose: ${keyModule.purpose}`,
          expectedResult: "You should understand how this module fits into the overall architecture and what it's responsible for.",
          codeExample: this.generateModuleExample(keyModule),
          tips: [
            "Look for the main functions or classes in this module",
            "Trace how data flows in and out",
            "Identify any external dependencies"
          ]
        }
      });
    }

    // Step 5: Make a simple modification
    steps.push({
      id: `step${stepNumber}`,
      number: stepNumber++,
      title: "Make Your First Modification",
      description: "Add a small feature or modify existing behavior",
      difficulty: "medium",
      isCritical: true,
      detail: {
        task: "Make a simple, safe modification to the codebase. This could be adding a log statement, changing a text string, or adding a simple function.",
        expectedResult: "Your changes should be reflected when you run the application. The app should still work correctly.",
        codeExample: "// Add your modification here\nconsole.log('My first change!');\n\n// Or modify a simple value\nconst greeting = 'Hello from my modified code!';",
        testCase: "Run the application and verify your changes are visible. Make sure nothing broke.",
        tips: [
          "Start with non-critical code areas",
          "Test immediately after making changes",
          "Use version control to easily revert if needed",
          "Document what you changed and why"
        ]
      }
    });

    return steps;
  }

  private generateSetupCommands(packageManager: string | undefined, devCommands: any): string {
    const installCmd = devCommands?.install || `${packageManager || 'npm'} install`;
    const runCmd = devCommands?.run || `${packageManager || 'npm'} run dev`;
    
    return `# Clone the repository
git clone <repository-url>
cd <project-directory>

# Install dependencies
${installCmd}

# Start development server
${runCmd}`;
  }

  private generateFileTree(modules: any[]): string {
    if (!modules || modules.length === 0) {
      return "src/\n├── index.ts\n└── ...";
    }

    let tree = "src/\n";
    modules.slice(0, 5).forEach((module, idx) => {
      const isLast = idx === Math.min(modules.length, 5) - 1;
      const prefix = isLast ? "└──" : "├──";
      tree += `${prefix} ${module.name || `module${idx + 1}`}/\n`;
      if (module.files && module.files.length > 0) {
        module.files.slice(0, 2).forEach((file: string) => {
          tree += `${isLast ? "    " : "│   "}├── ${file.split('/').pop()}\n`;
        });
      }
    });
    return tree;
  }

  private generateModuleExample(module: any): string {
    if (module.key_symbols && module.key_symbols.length > 0) {
      return `// Key symbols in this module:\n// ${module.key_symbols.join(', ')}\n\n// Purpose: ${module.purpose}\n\n// Files:\n${module.files?.slice(0, 3).map((f: string) => `// - ${f}`).join('\n') || '// (files not specified)'}`;
    }
    return `// Module: ${module.name}\n// Purpose: ${module.purpose}\n// Explore the files in this module to understand its implementation.`;
  }

  /**
   * Determine difficulty level based on concepts complexity
   */
  private determineDifficulty(main_concepts?: string[], modules?: any[]): string {
    if (!main_concepts) return 'beginner';
    
    const advancedConcepts = ['GraphQL', 'WebSocket', 'Middleware', 'SSR'];
    const hasAdvanced = main_concepts.some(c => advancedConcepts.includes(c));
    
    if (hasAdvanced || (modules && modules.length > 10)) {
      return 'advanced';
    }
    
    if (modules && modules.length > 5) {
      return 'intermediate';
    }
    
    return 'beginner';
  }

  /**
   * Estimate duration based on project size
   */
  private estimateDuration(moduleCount: number): string {
    if (moduleCount > 10) return '4-6 hours';
    if (moduleCount > 5) return '2-3 hours';
    return '1-2 hours';
  }

  /**
   * Generate prerequisites based on concepts and package manager
   */
  private generatePrerequisites(main_concepts?: string[], packageManager?: string): string[] {
    const prerequisites: string[] = ['Basic programming knowledge', 'Git fundamentals'];
    
    if (!main_concepts) return prerequisites;
    
    // Based on package manager
    if (packageManager === 'npm' || packageManager === 'yarn' || packageManager === 'pnpm') {
      prerequisites.push('JavaScript/Node.js basics');
    }
    if (packageManager === 'pip' || packageManager === 'poetry') {
      prerequisites.push('Python basics');
    }
    
    // Based on concepts
    if (main_concepts.includes('Component-based UI')) {
      prerequisites.push('Understanding of component architecture');
    }
    if (main_concepts.includes('REST API') || main_concepts.includes('GraphQL')) {
      prerequisites.push('API concepts');
    }
    if (main_concepts.includes('State Management')) {
      prerequisites.push('State management patterns (helpful)');
    }
    
    return prerequisites;
  }

  /**
   * Build glossary from explain_terms
   */
  private buildGlossary(explain_terms?: any[], packageManager?: string, main_concepts?: string[]): any[] {
    const glossary: any[] = [];

    // Add terms from analyzer
    if (explain_terms) {
      explain_terms.forEach(term => {
        glossary.push({
          term: term.term,
          explain_like_im_5: term.definition,
          when_to_use: this.getWhenToUse(term.term, packageManager),
          common_pitfall: this.getCommonPitfall(term.term)
        });
      });
    }

    return glossary;
  }

  private getWhenToUse(term: string, packageManager?: string): string {
    const usage: Record<string, string> = {
      'npm': 'Use for Node.js projects to install and manage JavaScript packages',
      'yarn': 'Alternative to npm with faster installs and better dependency resolution',
      'pnpm': 'Use when disk space is a concern - shares packages across projects',
      'pip': 'Use for Python projects to install libraries from PyPI',
      'poetry': 'Use for Python projects when you need better dependency management',
      'SSR': 'Use when SEO matters or you need faster initial page loads',
      'REST API': 'Use for standard CRUD operations and simple client-server communication',
      'GraphQL': 'Use when clients need flexible data fetching with complex queries',
      'State Management': 'Use when sharing data across multiple components gets complex',
    };
    return usage[term] || 'Used in this project for core functionality';
  }

  private getCommonPitfall(term: string): string {
    const pitfalls: Record<string, string> = {
      'npm': 'Forgetting to run npm install after pulling changes with new dependencies',
      'yarn': 'Mixing npm and yarn commands in the same project causes lockfile conflicts',
      'pnpm': 'Some packages may not work due to strict dependency isolation',
      'pip': 'Not using virtual environments leads to global package conflicts',
      'poetry': 'The pyproject.toml and poetry.lock must stay in sync',
      'SSR': 'Using browser-only APIs (like window) will break server rendering',
      'REST API': 'Over-fetching or under-fetching data when endpoints are too generic',
      'GraphQL': 'N+1 query problems if not using data loaders properly',
      'State Management': 'Overusing global state when local state would suffice',
    };
    return pitfalls[term] || 'Watch for edge cases specific to this implementation';
  }

  /**
   * Generate detailed learning path with typed steps
   */
  private generateDetailedLearningPath(
    main_concepts?: string[],
    modules?: any[],
    entry_points?: string[],
    dev_commands?: any,
    packageManager?: string,
    data_flow_edges?: any[],
    ground_truth_paths?: string[],
    keyFiles?: Record<string, string>
  ): any[] {
    const path: any[] = [];

    // Stage 1: Setup & Run
    const installCmd = dev_commands?.install || '<unknown>';
    const runCmd = dev_commands?.run || '<unknown>';
    const entryFile = entry_points && entry_points.length > 0 ? entry_points[0] : 'src/index.js';
    
    const setupSteps: any[] = [
      {
        title: 'Install dependencies',
        type: 'command',
        commands: [installCmd],
        why: `This ${packageManager || 'package manager'} command downloads all required libraries and dependencies for the project to work`,
        verify: {
          method: 'terminal_output_contains',
          expect: installCmd === '<unknown>' ? ['dependencies installed'] : ['added', 'packages', 'installed'],
          fallback_tip: installCmd === '<unknown>' 
            ? 'Check README for installation instructions or look for package.json/requirements.txt' 
            : 'If this fails, delete the lockfile and try again'
        }
      },
      {
        title: 'Open the entry point',
        type: 'code_reading',
        file_path: entryFile,
        snippet: this.getCodeSnippet(entryFile, keyFiles, 30),
        explanation: 'This file is where the application starts. It typically sets up the main configuration, initializes the framework, and starts the app.',
        check_yourself: 'Ask yourself: where is the first render or handler called? What gets executed first?'
      },
      {
        title: 'Run the dev server',
        type: 'command',
        commands: [runCmd],
        verify: {
          method: 'http_check',
          url_hint: 'http://localhost:3000 (check README or terminal output for actual port)',
          expect: ['app loads without error', 'server is running']
        }
      }
    ];

    path.push({
      stage: 'Setup & Run',
      goal: 'Run locally',
      concepts: ['installation', 'environment setup', 'dev server'],
      steps: setupSteps,
      quiz: [
        {
          question: 'Which package manager is used in this project?',
          options: ['npm', 'yarn', 'pnpm', 'pip', 'poetry'].filter(pm => pm === packageManager || ['npm', 'yarn', 'pip'].includes(pm)),
          answer: packageManager || 'unknown',
          why: `${packageManager || 'This package manager'} is configured for this project. Using different package managers can cause lockfile conflicts.`
        }
      ]
    });

    // Stage 2: Architecture & Data Flow
    const traceSteps: any[] = [];
    
    if (data_flow_edges && data_flow_edges.length > 0) {
      traceSteps.push({
        title: 'Trace data flow',
        type: 'trace',
        edges: data_flow_edges.slice(0, 5),
        explanation: 'Follow how data moves through the application from entry point to UI/output'
      });
    }

    const firstModule = modules && modules.length > 0 ? modules[0] : null;
    if (firstModule && firstModule.files && firstModule.files.length > 0) {
      const moduleFile = firstModule.files[0];
      traceSteps.push({
        title: `Read the ${firstModule.name} module`,
        type: 'code_reading',
        file_path: moduleFile,
        snippet: this.getCodeSnippet(moduleFile, keyFiles, 40),
        explanation: `This module handles ${firstModule.purpose}. Look for the key functions: ${firstModule.key_symbols?.slice(0, 3).join(', ') || 'main functions'}.`,
        why_it_matters: 'Understanding this module helps you see how the app handles core functionality'
      });
    }

    if (traceSteps.length > 0) {
      path.push({
        stage: 'Architecture & Data Flow',
        goal: 'Trace how data moves',
        concepts: main_concepts?.slice(0, 3) || ['routing', 'data flow', 'modules'],
        steps: traceSteps
      });
    }

    // Stage 3: Feature Exploration
    const modSteps: any[] = [];
    const safeFile = this.findSafeUIFile(modules, ground_truth_paths);
    
    if (safeFile) {
      modSteps.push({
        title: 'Make a harmless change',
        type: 'code_mod',
        file_path: safeFile,
        diff: `# Example: Change a text string or color\n- Old: "Hello World"\n+ New: "Hello CodeSensei"`,
        explanation: 'This is a safe change that updates visible UI without breaking functionality',
        verify: {
          method: 'manual_check',
          expect: ['UI text or color changed', 'no errors in console']
        }
      });
    }

    if (modSteps.length > 0) {
      path.push({
        stage: 'Feature Exploration',
        goal: 'Modify a real behavior safely',
        concepts: ['code modification', 'safe changes', 'verification'],
        steps: modSteps,
        mini_challenge: 'Add a console.log or print statement in a function and verify it appears when you interact with the app'
      });
    }

    // Stage 4: Build Your Own
    const scaffoldFile = this.suggestNewFilePath(modules, packageManager, ground_truth_paths);
    path.push({
      stage: 'Build Your Own',
      goal: 'Add a small feature',
      concepts: ['composition', 'best practices', 'integration'],
      steps: [
        {
          title: 'Create a new component or function',
          type: 'scaffold',
          file_path_suggestion: scaffoldFile,
          skeleton_code: this.generateSkeletonCode(scaffoldFile, packageManager),
          explanation: 'This creates a new reusable piece following the existing code patterns',
          verify: {
            method: 'code_compiles',
            expect: ['no syntax errors', 'no TypeScript errors']
          }
        }
      ],
      final_challenge: 'Integrate your new feature into the existing app and document it in README'
    });

    return path;
  }

  private getCodeSnippet(filePath: string, keyFiles?: Record<string, string>, maxLines: number = 30): string {
    if (!keyFiles || !keyFiles[filePath]) {
      return `// Code snippet from ${filePath}\n// (View the file to see implementation details)`;
    }

    const content = keyFiles[filePath];
    const lines = content.split('\n').slice(0, maxLines);
    return lines.join('\n') + (lines.length >= maxLines ? '\n// ... (more code below)' : '');
  }

  private findSafeUIFile(modules?: any[], ground_truth_paths?: string[]): string | null {
    if (!modules || !ground_truth_paths) return null;

    // Look for UI components
    const uiModule = modules.find(m => 
      m.name.toLowerCase().includes('component') || 
      m.name.toLowerCase().includes('ui')
    );

    if (uiModule && uiModule.files && uiModule.files.length > 0) {
      // Verify file exists in ground truth
      const safeFile = uiModule.files.find((f: string) => ground_truth_paths.includes(f));
      return safeFile || null;
    }

    return null;
  }

  private suggestNewFilePath(modules?: any[], packageManager?: string, ground_truth_paths?: string[]): string {
    // Suggest based on existing structure
    if (modules && modules.length > 0) {
      const componentModule = modules.find(m => m.name.toLowerCase().includes('component'));
      if (componentModule && componentModule.files && componentModule.files.length > 0) {
        const basePath = componentModule.files[0].split('/').slice(0, -1).join('/');
        return `${basePath}/MyFeature${packageManager?.includes('npm') ? '.tsx' : '.py'}`;
      }
    }

    // Default suggestions
    if (packageManager === 'npm' || packageManager === 'yarn' || packageManager === 'pnpm') {
      return 'src/components/MyFeature.tsx';
    } else if (packageManager === 'pip' || packageManager === 'poetry') {
      return 'src/my_feature.py';
    }

    return 'src/MyFeature.js';
  }

  private generateSkeletonCode(filePath: string, packageManager?: string): string {
    const isReact = filePath.endsWith('.tsx') || filePath.endsWith('.jsx');
    const isPython = filePath.endsWith('.py');

    if (isReact) {
      return `import React from 'react';

export const MyFeature = () => {
  return (
    <div className="my-feature">
      <h2>My New Feature</h2>
      <p>This is a new feature I built!</p>
    </div>
  );
};`;
    } else if (isPython) {
      return `def my_feature():
    """
    A new feature I built
    """
    return "Hello from my feature"`;
    } else {
      return `export function myFeature() {
  console.log('My new feature');
  return 'Hello from my feature';
}`;
    }
  }

  /**
   * Categorize tech stack into languages, frameworks, and tools
   */
  private categorizeTechStack(tech_stack: string[]): {
    languages: string[];
    frameworks: string[];
    tools: string[];
  } {
    const languages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Ruby', 'PHP', 'C++', 'C#', 'Rust'];
    const frameworks = ['React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Express.js', 'Django', 'Flask', 'Spring Boot'];
    
    return {
      languages: tech_stack.filter(t => languages.includes(t)),
      frameworks: tech_stack.filter(t => frameworks.includes(t)),
      tools: tech_stack.filter(t => !languages.includes(t) && !frameworks.includes(t)),
    };
  }

  /**
   * Get description for a technology
   */
  private getTechDescription(tech: string): string {
    const descriptions: Record<string, string> = {
      'JavaScript': 'Core language for web development',
      'TypeScript': 'JavaScript with static typing for better code quality',
      'Python': 'Versatile language for backend and data processing',
      'React': 'Popular UI library for building interactive interfaces',
      'Vue.js': 'Progressive framework for building user interfaces',
      'Next.js': 'React framework with server-side rendering',
      'Express.js': 'Minimal and flexible Node.js web framework',
      'Django': 'High-level Python web framework',
      'Flask': 'Lightweight Python web framework',
      'Vite': 'Next-generation frontend build tool',
      'Webpack': 'Module bundler for JavaScript applications',
      'Jest': 'JavaScript testing framework',
      'PostgreSQL': 'Powerful relational database',
      'MongoDB': 'NoSQL document database',
      'Redis': 'In-memory data structure store',
    };

    return descriptions[tech] || 'Technology used in this project';
  }

  /**
   * Get learning tip for a module
   */
  private getModuleLearningTip(moduleName: string): string {
    if (moduleName.includes('component')) {
      return '💡 **Learning Tip**: Start by exploring the main components to understand the UI structure.';
    }
    if (moduleName.includes('service')) {
      return '💡 **Learning Tip**: Services contain business logic - understand these to grasp core functionality.';
    }
    if (moduleName.includes('api')) {
      return '💡 **Learning Tip**: API layer connects frontend to backend - trace the data flow here.';
    }
    if (moduleName.includes('utils') || moduleName.includes('helper')) {
      return '💡 **Learning Tip**: Utility functions are reusable helpers - great examples for learning best practices.';
    }
    if (moduleName.includes('model')) {
      return '💡 **Learning Tip**: Models define data structure - understand these to work with the database.';
    }
    return '💡 **Learning Tip**: Examine the files in this module to understand its role in the project.';
  }

  /**
   * Generate a learning path
   */
  private generateLearningPath(tech_stack?: string[], core_modules?: any[]): string {
    let path = '';
    
    path += `### Step 1: Setup Environment\n`;
    path += `- Clone the repository\n`;
    path += `- Install dependencies\n`;
    if (tech_stack?.includes('Node') || tech_stack?.includes('npm')) {
      path += `- Run \`npm install\` or \`yarn install\`\n`;
    }
    path += `- Review the README for setup instructions\n\n`;

    path += `### Step 2: Explore Core Files\n`;
    path += `- Start with the entry point (main.ts, index.js, or app.py)\n`;
    path += `- Trace the application flow from initialization\n`;
    path += `- Identify configuration files\n\n`;

    path += `### Step 3: Study Key Modules\n`;
    if (core_modules && core_modules.length > 0) {
      path += `Focus on these critical modules:\n`;
      core_modules.slice(0, 3).forEach((m: any) => {
        path += `- ${m.name}: ${m.purpose}\n`;
      });
    } else {
      path += `- Examine the folder structure\n`;
      path += `- Read through major components\n`;
    }
    path += '\n';

    path += `### Step 4: Run the Project\n`;
    path += `- Start the development server\n`;
    path += `- Test core functionality\n`;
    path += `- Make small changes and observe results\n\n`;

    path += `### Step 5: Experiment\n`;
    path += `- Try adding a new feature\n`;
    path += `- Modify existing components\n`;
    path += `- Write tests for your changes\n\n`;

    return path;
  }

  /**
   * Generate practice exercises
   */
  private generateExercises(projectName?: string, tech_stack?: string[], core_modules?: any[]): string {
    let exercises = '';

    exercises += `### Exercise 1: Code Exploration\n\n`;
    exercises += `**Objective**: Understand the codebase structure\n\n`;
    exercises += `**Tasks**:\n`;
    exercises += `1. Identify the main entry point of the application\n`;
    exercises += `2. Map out the folder structure and its purpose\n`;
    exercises += `3. Find where configuration is stored\n`;
    exercises += `4. Document your findings in a simple diagram\n\n`;
    exercises += `**Expected Time**: 30-45 minutes\n\n`;

    exercises += `### Exercise 2: Feature Implementation\n\n`;
    exercises += `**Objective**: Apply your knowledge by building something new\n\n`;
    exercises += `**Tasks**:\n`;
    
    if (tech_stack?.includes('React') || tech_stack?.includes('Vue.js')) {
      exercises += `1. Create a new component that displays project statistics\n`;
      exercises += `2. Add a button that triggers a simple action\n`;
      exercises += `3. Style your component using the project's styling approach\n`;
      exercises += `4. Test your component in the application\n\n`;
    } else if (tech_stack?.includes('Python')) {
      exercises += `1. Add a new API endpoint\n`;
      exercises += `2. Implement basic input validation\n`;
      exercises += `3. Write unit tests for your endpoint\n`;
      exercises += `4. Document your API endpoint\n\n`;
    } else {
      exercises += `1. Add a new feature or improve an existing one\n`;
      exercises += `2. Follow the project's coding conventions\n`;
      exercises += `3. Write tests for your changes\n`;
      exercises += `4. Document what you built\n\n`;
    }
    
    exercises += `**Expected Time**: 1-2 hours\n\n`;
    exercises += `**Challenge**: Can you make your feature reusable for other parts of the application?\n\n`;

    return exercises;
  }

  /**
   * Generate additional resources
   */
  private generateResources(tech_stack?: string[]): string {
    let resources = '';

    resources += `### Official Documentation\n`;
    if (tech_stack) {
      tech_stack.slice(0, 5).forEach(tech => {
        const link = this.getOfficialDocs(tech);
        if (link) {
          resources += `- [${tech} Documentation](${link})\n`;
        }
      });
    }
    resources += '\n';

    resources += `### Learning Platforms\n`;
    resources += `- [freeCodeCamp](https://www.freecodecamp.org/) - Free coding tutorials\n`;
    resources += `- [MDN Web Docs](https://developer.mozilla.org/) - Web development reference\n`;
    resources += `- [GitHub Learning Lab](https://lab.github.com/) - Interactive Git tutorials\n\n`;

    resources += `### Community\n`;
    resources += `- Join discussions in the repository's Issues and Discussions\n`;
    resources += `- Check Stack Overflow for common questions\n`;
    resources += `- Connect with other learners on Discord or Reddit\n\n`;

    return resources;
  }

  /**
   * Get official documentation links
   */
  private getOfficialDocs(tech: string): string | null {
    const docs: Record<string, string> = {
      'React': 'https://react.dev',
      'Vue.js': 'https://vuejs.org',
      'Angular': 'https://angular.io',
      'TypeScript': 'https://www.typescriptlang.org',
      'JavaScript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      'Python': 'https://docs.python.org',
      'Django': 'https://docs.djangoproject.com',
      'Flask': 'https://flask.palletsprojects.com',
      'Express.js': 'https://expressjs.com',
      'Next.js': 'https://nextjs.org/docs',
    };

    return docs[tech] || null;
  }

  /**
   * Get community size description
   */
  private getCommunitySize(stars: number): string {
    if (stars > 10000) return 'Large and active';
    if (stars > 1000) return 'Active community';
    if (stars > 100) return 'Growing community';
    return 'Small community';
  }
}

// Export singleton instance
export const teacherAgent = new TeacherAgent();
