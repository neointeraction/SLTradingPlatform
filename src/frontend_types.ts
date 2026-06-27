export interface CustomAgentConfig {
  name: string;
  role: string;
  goal: string;
  backstory: string;
  allowedToolIds: ('news_fetcher' | 'technical_analysis' | 'order_execution')[];
}

export interface OrchestrateRequest {
  ticker: string;
  customAgents?: CustomAgentConfig[];
}

export interface AgentLog {
  agentName: string;
  role: string;
  taskDescription: string;
  output: string;
}

export interface OrchestrateResponse {
  status: 'success' | 'error';
  ticker: string;
  executionSummary: string;
  agentLogs: AgentLog[];
}
