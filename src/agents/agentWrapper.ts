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
    
    if ('invoke' in agent) {
      // Handle AgentExecutor
      const result = await agent.invoke({ input });
      output = result.output;
      chainOfThought = agent.steps || [];
    } else {
      // Handle BaseLanguageModel
      output = await agent.invoke(input);
      chainOfThought = undefined;
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