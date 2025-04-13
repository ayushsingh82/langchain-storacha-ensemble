import { BaseLanguageModel } from 'langchain/base_language';
import { AgentExecutor } from 'langchain/agents';
import { StorachaClient } from '../storage/storachaClient';
import { AgentData, StorachaConfig } from '../types';

export class StorachaAgentWrapper {
  private storacha: StorachaClient;
  private agentId: string;
  
  constructor(agentId: string, storachaConfig?: StorachaConfig) {
    this.storacha = new StorachaClient(storachaConfig);
    this.agentId = agentId;
  }

  async run(
    agent: AgentExecutor | BaseLanguageModel, 
    input: string, 
    metadata: Record<string, any> = {}
  ): Promise<any> {
    const startTime = Date.now();
    
    // Execute the agent
    let output;
    let chainOfThought;
    
    try {
      if ('invoke' in agent) {
        if ('runWithCallback' in agent) {
          // For AgentExecutor
          const result = await (agent as any).invoke({ input });
          output = result.output || result;
          chainOfThought = (agent as any).steps || [];
        } else {
          // For BaseLanguageModel
          output = await (agent as BaseLanguageModel).invoke(input);
          chainOfThought = undefined;
        }
      } else {
        throw new Error('Unsupported agent type');
      }
    } catch (error) {
      console.error('Error invoking agent:', error);
      throw error;
    }
    
    // Prepare data for storage
    const agentData: AgentData = {
      agentId: this.agentId,
      input,
      output,
      timestamp: new Date().toISOString(),
      chainOfThought,
      metadata: {
        ...metadata,
        executionTimeMs: Date.now() - startTime
      }
    };
    
    // Store in Storacha
    await this.storacha.upload(
      agentData, 
      `agent-${this.agentId}-${Date.now()}`
    );
    
    return output;
  }
} 