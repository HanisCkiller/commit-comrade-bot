// Agent types and interfaces

export interface MCPEndpoint {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  params?: Record<string, string>;
}

export interface AgentConfig {
  name: string;
  role: string;
  systemPrompt: string;
  mcpEndpoint?: MCPEndpoint;
}

export interface RepoSnapshot {
  readme?: string;
  fileTree?: string[];
  keyFiles?: Record<string, string>;
  metadata?: {
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
  };
}

export interface AgentResponse {
  success: boolean;
  data?: any;
  error?: string;
  agentName: string;
}
