import type { AgentConfig, AgentResponse, RepoSnapshot } from '@/types/agents';

/**
 * Teacher Agent
 * Converts analyzed repository data into clear educational tutorials
 */
class TeacherAgent {
  private config: AgentConfig = {
    name: 'Teacher',
    role: 'Generate educational tutorials from analysis',
    systemPrompt: `You are an AI teacher. 
Using the analysis JSON, generate a detailed tutorial in Markdown format.
Include:
- Overview
- Tech Stack
- Key Modules
- Learning Path
- 2 practice exercises`,
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
   * Create a comprehensive educational tutorial
   */
  private createTutorial(repoData: RepoSnapshot, analysisData: any): string {
    const { metadata, readme, fileTree, keyFiles } = repoData;
    const { tech_stack, core_modules, important_files, summary } = analysisData;

    let tutorial = '';

    // Title
    tutorial += `# 📚 Tutorial: ${metadata?.name || 'Repository'}\n\n`;

    // Project Overview
    tutorial += `## 🎯 Project Overview\n\n`;
    tutorial += `${summary || metadata?.description || 'A software project for learning and exploration.'}\n\n`;
    
    if (metadata) {
      tutorial += `### Repository Stats\n\n`;
      tutorial += `- **Primary Language**: ${metadata.language}\n`;
      tutorial += `- **Stars**: ${metadata.stars} ⭐\n`;
      tutorial += `- **Forks**: ${metadata.forks} 🍴\n`;
      tutorial += `- **Community**: ${this.getCommunitySize(metadata.stars)}\n\n`;
    }

    // Tech Stack Explanation
    if (tech_stack && tech_stack.length > 0) {
      tutorial += `## 🛠️ Tech Stack\n\n`;
      tutorial += `This project leverages the following technologies:\n\n`;
      
      const categorized = this.categorizeTechStack(tech_stack);
      
      if (categorized.languages.length > 0) {
        tutorial += `### Programming Languages\n`;
        categorized.languages.forEach(tech => {
          tutorial += `- **${tech}**: ${this.getTechDescription(tech)}\n`;
        });
        tutorial += '\n';
      }

      if (categorized.frameworks.length > 0) {
        tutorial += `### Frameworks & Libraries\n`;
        categorized.frameworks.forEach(tech => {
          tutorial += `- **${tech}**: ${this.getTechDescription(tech)}\n`;
        });
        tutorial += '\n';
      }

      if (categorized.tools.length > 0) {
        tutorial += `### Build Tools & Others\n`;
        categorized.tools.forEach(tech => {
          tutorial += `- **${tech}**: ${this.getTechDescription(tech)}\n`;
        });
        tutorial += '\n';
      }
    }

    // Key Modules
    if (core_modules && core_modules.length > 0) {
      tutorial += `## 📦 Key Modules\n\n`;
      tutorial += `Understanding the project structure:\n\n`;
      
      core_modules.forEach((module: any, index: number) => {
        tutorial += `### ${index + 1}. ${module.name}\n\n`;
        tutorial += `**Purpose**: ${module.purpose}\n\n`;
        tutorial += this.getModuleLearningTip(module.name) + '\n\n';
      });
    }

    // Important Files Walkthrough
    if (important_files && important_files.length > 0) {
      tutorial += `## 📄 Key Files Walkthrough\n\n`;
      
      important_files.forEach((file: any) => {
        tutorial += `### \`${file.file}\`\n\n`;
        tutorial += `${file.description}\n\n`;
        
        // Add specific content if available in keyFiles
        if (keyFiles && keyFiles[file.file]) {
          const content = keyFiles[file.file];
          const preview = content.split('\n').slice(0, 10).join('\n');
          tutorial += '```\n' + preview;
          if (content.split('\n').length > 10) {
            tutorial += '\n... (truncated)';
          }
          tutorial += '\n```\n\n';
        }
      });
    }

    // Learning Path
    tutorial += `## 🎓 Learning Path\n\n`;
    tutorial += `Follow this path to understand the project:\n\n`;
    tutorial += this.generateLearningPath(tech_stack, core_modules);

    // Practice Exercises
    tutorial += `## 💪 Practice Exercises\n\n`;
    tutorial += this.generateExercises(metadata?.name, tech_stack, core_modules);

    // Additional Resources
    tutorial += `## 📚 Additional Resources\n\n`;
    tutorial += this.generateResources(tech_stack);

    // Footer
    tutorial += `---\n\n`;
    tutorial += `*Tutorial generated by CodeSensei Multi-Agent System*\n\n`;
    tutorial += `🤖 **Agents Used**:\n`;
    tutorial += `- 🧠 RepoCrawler: Fetched repository data via MCP\n`;
    tutorial += `- 📊 CodeAnalyzer: Analyzed structure and tech stack\n`;
    tutorial += `- 👨‍🏫 Teacher: Generated educational content\n\n`;
    tutorial += `Happy Learning! 🚀\n`;

    return tutorial;
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
