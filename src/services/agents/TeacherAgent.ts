import type { AgentConfig, AgentResponse, RepoSnapshot } from '@/types/agents';

/**
 * Teacher Agent
 * Converts analyzed repository data into clear educational tutorials
 */
class TeacherAgent {
  private config: AgentConfig = {
    name: 'Teacher',
    role: 'Generate interactive learning journeys',
    systemPrompt: `You are CodeSensei 🥷 — a wise AI coding mentor who transforms open-source repositories into immersive, hands-on learning journeys.

Your goal: Teach the user to **understand, modify, and master** this repository step by step — just like Codecrafters or Buildspace.

Design a **structured Learning Journey** for a developer who wants to master this project *by building and experimenting*, not just reading.

Generate a **JSON output** that represents a full interactive course with stages, checkpoints, quizzes, and mini-challenges.

STYLE:
- Use concise but encouraging language.
- Avoid overwhelming details; focus on learning by doing.
- Each stage should feel like a mini-level in a coding game.
- Use terminology accessible to junior developers.

OUTPUT REQUIREMENTS:
- Strictly output valid JSON (no Markdown, no commentary).
- Keep learning_path around 3–5 stages.
- Include quizzes and mini-challenges for engagement.`,
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
   * Create an interactive learning journey in JSON format
   */
  private createTutorial(repoData: RepoSnapshot, analysisData: any): string {
    const { metadata } = repoData;
    const { 
      repo_name, 
      package_manager, 
      dev_commands, 
      entry_points, 
      main_concepts, 
      modules, 
      explain_terms 
    } = analysisData;

    const difficultyLevel = this.determineDifficulty(main_concepts, modules);
    const prerequisites = this.generatePrerequisites(main_concepts, package_manager);
    const learningPath = this.generateInteractiveLearningPath(
      main_concepts, 
      modules, 
      entry_points, 
      dev_commands,
      package_manager
    );

    const learningJourney = {
      project_title: repo_name || metadata?.name || 'Repository Learning Journey',
      overview: `Master ${repo_name || 'this project'} through hands-on learning. ${metadata?.description || 'Understand the architecture, run it locally, and build your own features.'}`,
      difficulty_level: difficultyLevel,
      estimated_duration: this.estimateDuration(modules?.length || 0),
      prerequisites: prerequisites,
      learning_objectives: [
        'Understand how the project works',
        'Run it locally and explore the codebase',
        'Modify key components and features',
        'Implement a small new feature independently'
      ],
      learning_path: learningPath,
      final_project: {
        goal: 'Apply all learned concepts to extend the app meaningfully',
        description: 'Add a new feature that integrates with the existing codebase (e.g., new UI component, API endpoint, or utility function).',
        expected_learning: [
          'Full understanding of the repository structure',
          'Confidence modifying and extending open-source code',
          'Ability to read, trace, and refactor complex codebases'
        ]
      }
    };

    return JSON.stringify(learningJourney, null, 2);
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
   * Generate interactive learning path with stages
   */
  private generateInteractiveLearningPath(
    main_concepts?: string[],
    modules?: any[],
    entry_points?: string[],
    dev_commands?: any,
    packageManager?: string
  ): any[] {
    const path: any[] = [];

    // Stage 1: Setup & Run
    const installCmd = dev_commands?.install || 'unknown';
    const runCmd = dev_commands?.run || 'unknown';
    
    path.push({
      stage: 'Setup & Run',
      goal: 'Get the project running locally',
      concepts: ['installation', 'dependency management', 'environment setup'],
      steps: [
        'Clone the repository to your local machine',
        'Read the README.md for setup instructions',
        `Install dependencies: ${installCmd}`,
        `Run the development server: ${runCmd}`
      ],
      checkpoint: 'You can successfully run the project and see the output in your browser or terminal',
      quiz: [
        {
          question: 'Which command installs dependencies in this project?',
          options: [installCmd, 'pip install', 'npm install', 'yarn install'].filter((v, i, a) => a.indexOf(v) === i),
          answer: installCmd
        }
      ]
    });

    // Stage 2: Architecture & Core Logic
    const entryFile = entry_points && entry_points.length > 0 ? entry_points[0] : 'the entry point file';
    
    path.push({
      stage: 'Architecture & Core Logic',
      goal: 'Understand how main components interact',
      concepts: main_concepts?.slice(0, 3) || ['code architecture', 'data flow'],
      steps: [
        `Open ${entryFile} to understand the app initialization`,
        'Trace the main data flow through the application',
        'Map out how different modules communicate',
        'Document the architecture in a simple diagram'
      ],
      checkpoint: 'You can explain the project architecture and main data flow',
      mini_challenge: 'Add a console.log or print statement in a key function and verify it executes when you interact with the app.'
    });

    // Stage 3: Feature Exploration
    const firstModule = modules && modules.length > 0 ? modules[0] : null;
    path.push({
      stage: 'Feature Exploration',
      goal: 'Experiment with modifying a core feature',
      concepts: ['code modification', 'testing changes', 'debugging'],
      steps: [
        firstModule ? `Open the ${firstModule.name} module` : 'Choose a main component to modify',
        firstModule ? `Explore files: ${firstModule.files.slice(0, 2).join(', ')}` : 'Pick a file to modify',
        'Make a small change (e.g., update text, change a color, modify logic)',
        `Run ${runCmd} and verify your change appears`
      ],
      checkpoint: 'You successfully modified a feature and confirmed the result',
      mini_challenge: 'Add a new button or function that logs user interaction to the console.'
    });

    // Stage 4: Build Your Own
    path.push({
      stage: 'Build Your Own',
      goal: 'Create a small new feature from scratch',
      concepts: ['feature implementation', 'code organization', 'best practices'],
      steps: [
        'Plan a small addition (like a new component, function, or route)',
        'Follow the existing code patterns and conventions',
        'Implement your feature step by step',
        'Test it thoroughly and document what you built'
      ],
      checkpoint: 'You build a working mini-feature using what you learned',
      final_challenge: 'Build a feature that interacts with existing code (e.g., a new UI element that uses existing data or a utility function).'
    });

    return path;
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
