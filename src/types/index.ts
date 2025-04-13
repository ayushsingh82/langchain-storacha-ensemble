export interface AgentData {
  agentId: string;
  input: string;
  output: any;
  timestamp: string;
  chainOfThought?: any[];
  metadata?: Record<string, any>;
}

export interface StorachaConfig {
  apiKey?: string;
  endpoint?: string;
  namespace?: string;
}

export interface EnsembleConfig {
  votingStrategy: 'majority' | 'weighted' | 'confidence';
  weights?: Record<string, number>;
} 