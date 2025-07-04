import { anthropic } from '@ai-sdk/anthropic';
import { Agent } from '@mastra/core/agent';
import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

const llm = anthropic('claude-3-5-sonnet-20241022');

const agent = new Agent({
  name: 'Stellar Workflow Agent',
  model: llm,
  instructions: `
    You are a Stellar blockchain assistant that helps users create accounts and perform operations.
    
    Analyze the operation results and provide clear, helpful feedback to users about:
    - Account creation success
    - Account balance and status
    - Transaction outcomes
    - Any errors or issues that occurred
    
    Always format your responses in a clear, structured way with:
    - Clear section headers
    - Key information highlighted
    - Next steps or recommendations
    - Security reminders when appropriate
  `,
});

const createStellarAccount = createStep({
  id: 'create-stellar-account',
  description: 'Creates a new Stellar account keypair',
  inputSchema: z.object({
    network: z.enum(['testnet', 'mainnet']).default('testnet'),
  }),
  outputSchema: z.object({
    publicKey: z.string(),
    secretKey: z.string(),
    network: z.string(),
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    try {
      // This would typically call the MCP stellar tools
      // For now, we'll simulate the account creation
      const timestamp = Date.now().toString();
      const mockPublicKey = `G${timestamp.padEnd(55, 'X')}`;
      const mockSecretKey = `S${timestamp.padEnd(55, 'X')}`;

      return {
        publicKey: mockPublicKey,
        secretKey: mockSecretKey,
        network: inputData.network,
        success: true,
        message: `Successfully created new Stellar account for ${inputData.network}`
      };
    } catch (error) {
      return {
        publicKey: '',
        secretKey: '',
        network: inputData.network,
        success: false,
        message: `Failed to create account: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  },
});

const getStellarAccountInfo = createStep({
  id: 'get-stellar-account-info',
  description: 'Gets information about a Stellar account',
  inputSchema: z.object({
    publicKey: z.string(),
  }),
  outputSchema: z.object({
    accountId: z.string(),
    balance: z.string(),
    exists: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    try {
      // This would typically call the MCP stellar tools
      // For now, we'll simulate the account lookup
      return {
        accountId: inputData.publicKey,
        balance: '0.0000000',
        exists: true,
        message: `Account information retrieved for ${inputData.publicKey.substring(0, 8)}...`
      };
    } catch (error) {
      return {
        accountId: inputData.publicKey,
        balance: '0.0000000',
        exists: false,
        message: `Failed to get account info: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  },
});

const generateStellarReport = createStep({
  id: 'generate-stellar-report',
  description: 'Generates a comprehensive report about Stellar operations',
  inputSchema: z.object({
    accountData: z.object({
      publicKey: z.string(),
      secretKey: z.string(),
      network: z.string(),
      success: z.boolean(),
      message: z.string(),
    }),
    accountInfo: z.object({
      accountId: z.string(),
      balance: z.string(),
      exists: z.boolean(),
      message: z.string(),
    }),
  }),
  outputSchema: z.object({
    report: z.string(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    const { accountData, accountInfo } = inputData;

    const prompt = `Generate a comprehensive report about the Stellar account operations:

Account Creation:
${JSON.stringify(accountData, null, 2)}

Account Information:
${JSON.stringify(accountInfo, null, 2)}

Please provide a clear, formatted report that includes:
- Account creation status
- Account details and balance
- Security recommendations
- Next steps for the user
- Any warnings or important notes`;

    const response = await agent.stream([
      {
        role: 'user',
        content: prompt,
      },
    ]);

    let reportText = '';

    for await (const chunk of response.textStream) {
      process.stdout.write(chunk);
      reportText += chunk;
    }

    return {
      report: reportText,
    };
  },
});

export const stellarWorkflow = createWorkflow({
  id: 'stellar-workflow',
  inputSchema: z.object({
    network: z.enum(['testnet', 'mainnet']).default('testnet'),
  }),
  outputSchema: z.object({
    publicKey: z.string(),
    secretKey: z.string(),
    network: z.string(),
    success: z.boolean(),
    message: z.string(),
  }),
})
  .then(createStellarAccount);

stellarWorkflow.commit(); 