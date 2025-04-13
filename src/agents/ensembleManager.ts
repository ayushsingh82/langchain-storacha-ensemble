import { StorachaClient } from '../storage/storachaClient';
import { AgentData, EnsembleConfig, StorachaConfig } from '../types';

export class EnsembleManager {
  private storacha: StorachaClient;
  private config: EnsembleConfig;
  
  constructor(storachaConfig?: StorachaConfig, ensembleConfig?: Partial<EnsembleConfig>) {
    this.storacha = new StorachaClient(storachaConfig);
    this.config = {
      votingStrategy: ensembleConfig?.votingStrategy || 'majority',
      weights: ensembleConfig?.weights || {}
    };
  }
  
  async collectAgentData(agentIds: string[]): Promise<AgentData[]> {
    let allData: AgentData[] = [];
    
    for (const id of agentIds) {
      const agentData = await this.storacha.fetch(`agent-${id}`);
      allData = allData.concat(agentData);
    }
    
    return allData;
  }
  
  async aggregateResults(agentIds: string[], query?: string): Promise<any> {
    const allData = await this.collectAgentData(agentIds);
    
    // Filter by query if provided
    const relevantData = query 
      ? allData.filter(data => data.input.includes(query))
      : allData;
    
    if (relevantData.length === 0) {
      return null;
    }
    
    switch (this.config.votingStrategy) {
      case 'majority':
        return this.majorityVote(relevantData);
      case 'weighted':
        return this.weightedVote(relevantData);
      case 'confidence':
        return this.confidenceBasedVote(relevantData);
      default:
        return this.majorityVote(relevantData);
    }
  }
  
  private majorityVote(data: AgentData[]): any {
    const outputs = data.map(d => JSON.stringify(d.output));
    const freq: Record<string, number> = {};
    
    for (const out of outputs) {
      freq[out] = (freq[out] || 0) + 1;
    }
    
    const [mostFrequent] = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])[0];
      
    return JSON.parse(mostFrequent);
  }
  
  private weightedVote(data: AgentData[]): any {
    const outputScores: Record<string, number> = {};
    
    for (const item of data) {
      const weight = this.config.weights?.[item.agentId] || 1;
      const outKey = JSON.stringify(item.output);
      outputScores[outKey] = (outputScores[outKey] || 0) + weight;
    }
    
    const [highestScored] = Object.entries(outputScores)
      .sort((a, b) => b[1] - a[1])[0];
      
    return JSON.parse(highestScored);
  }
  
  private confidenceBasedVote(data: AgentData[]): any {
    // This is a placeholder - in a real implementation,
    // you would extract confidence scores from metadata or chain of thought
    return this.majorityVote(data);
  }
} 