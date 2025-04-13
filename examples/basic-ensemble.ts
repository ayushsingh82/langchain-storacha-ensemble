import { ChatOpenAI } from "langchain/chat_models/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { ChatPromptTemplate } from "langchain/prompts";
import { StorachaAgentWrapper, EnsembleManager } from "langchain-storacha-ensemble";

async function runExample() {
  // Create two different LLM models
  const gpt35 = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });
  const gpt4 = new ChatOpenAI({ modelName: "gpt-4" });
  
  // Create Storacha wrappers for each agent
  const agentA = new StorachaAgentWrapper("gpt35-agent", {
    apiKey: process.env.STORACHA_API_KEY
  });
  
  const agentB = new StorachaAgentWrapper("gpt4-agent", {
    apiKey: process.env.STORACHA_API_KEY
  });
  
  // Run both agents on the same input
  const question = "What are the key differences between quantum computing and classical computing?";
  
  console.log("Running Agent A (GPT-3.5)...");
  await agentA.run(gpt35, question);
  
  console.log("Running Agent B (GPT-4)...");
  await agentB.run(gpt4, question);
  
  // Create ensemble manager with weighted voting
  const ensemble = new EnsembleManager(
    { apiKey: process.env.STORACHA_API_KEY },
    { 
      votingStrategy: "weighted",
      weights: {
        "gpt35-agent": 1,
        "gpt4-agent": 2  // GPT-4 gets double the weight
      }
    }
  );
  
  // Get ensemble result
  const result = await ensemble.aggregateResults(
    ["gpt35-agent", "gpt4-agent"],
    question
  );
  
  console.log("\n--- Ensemble Result ---");
  console.log(result);
}

runExample().catch(console.error); 