# Stellar AI Demo

This project contains both a weather agent and a Stellar blockchain agent built with Mastra. The Stellar agent can interact with the Stellar network through MCP (Model Context Protocol) tools.

## Project Structure

```
src/mastra/
├── agents/
│   ├── weather-agent.ts      # Original weather agent
│   └── stellar-agent.ts      # New Stellar blockchain agent
├── tools/
│   ├── weather-tool.ts       # Weather API tools
│   └── stellar-tools.ts      # Stellar blockchain tools (with MCP placeholders)
├── workflows/
│   ├── weather-workflow.ts   # Weather workflow
│   └── stellar-workflow.ts   # Stellar account creation workflow
├── mcp-config.ts            # MCP configuration and setup guide
└── index.ts                 # Main Mastra configuration
```

## Features

### Weather Agent (Original)
- Get current weather for any location
- Weather-based activity recommendations
- Workflow for comprehensive weather analysis

### Stellar Agent (New)
- Create Stellar accounts
- Get account information and balances
- Send XLM payments
- View transaction history
- Get asset information
- Educational Stellar blockchain assistance

## Stellar Agent Capabilities

The Stellar agent includes the following tools:

1. **stellarAccountTool** - Get account information including balances and details
2. **stellarPaymentTool** - Send XLM payments between accounts
3. **stellarCreateAccountTool** - Create new Stellar keypairs
4. **stellarTransactionHistoryTool** - Get transaction history for accounts
5. **stellarAssetInfoTool** - Get information about Stellar assets

## Current Status

⚠️ **MCP Integration Pending**: The Stellar tools currently use placeholder implementations. To enable full Stellar functionality, you need to:

1. Set up a Stellar MCP server
2. Configure the MCP tools
3. Replace placeholder implementations with actual MCP calls

## Getting Started

### Prerequisites
- Node.js >= 20.9.0
- npm or pnpm

### Installation
```bash
npm install
```

### Running the Project
```bash
# Development mode
npm run dev

# Build
npm run build

# Start
npm start
```

## Setting Up MCP for Stellar Operations

To enable full Stellar functionality, follow these steps:

### 1. Create a Stellar MCP Server

You'll need to create an MCP server that implements Stellar SDK operations. The server should handle:
- Account creation and management
- Payment transactions
- Account information retrieval
- Transaction history
- Asset information

### 2. Configure MCP Tools

See `src/mastra/mcp-config.ts` for the configuration structure and setup instructions.

### 3. Update Tool Implementations

Replace the placeholder `execute` functions in `src/mastra/tools/stellar-tools.ts` with actual MCP tool calls.

Example of how to update a tool:
```typescript
// Before (placeholder)
execute: async ({ context }) => {
  return {
    accountId: context.accountId,
    balance: "0.0000000",
    // ... placeholder data
  };
}

// After (with MCP)
execute: async ({ context }) => {
  const result = await mcpClient.callTool('stellar-account-info', {
    accountId: context.accountId
  });
  return result;
}
```

## Usage Examples

### Using the Stellar Agent
```typescript
import { stellarAgent } from './src/mastra/agents/stellar-agent';

// Get account information
const accountInfo = await stellarAgent.generate([{
  role: 'user',
  content: 'Get information for account GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
}]);

// Create a new account
const newAccount = await stellarAgent.generate([{
  role: 'user',
  content: 'Create a new Stellar account on testnet'
}]);
```

### Using the Stellar Workflow
```typescript
import { stellarWorkflow } from './src/mastra/workflows/stellar-workflow';

// Run the account creation workflow
const result = await stellarWorkflow.execute({
  network: 'testnet'
});
```

## Environment Variables

When setting up your MCP server, you may need these environment variables:
- `STELLAR_NETWORK` - 'testnet' or 'mainnet'
- `STELLAR_HORIZON_URL` - Horizon server URL
- Any other Stellar SDK configuration

## Security Notes

⚠️ **Important Security Considerations**:
- Never expose secret keys in your code
- Use testnet for development
- Validate all inputs carefully
- Implement proper error handling
- Consider rate limiting for production use

## Dependencies

### Core Dependencies
- `@mastra/core` - Mastra framework
- `@mastra/mcp` - MCP tools support
- `@ai-sdk/anthropic` - Claude AI model
- `@mastra/memory` - Agent memory
- `@mastra/libsql` - Database storage

### Stellar Dependencies (for MCP server)
You'll need to install these in your MCP server:
- `stellar-sdk` - Official Stellar SDK
- Any additional Stellar-related packages

## Next Steps

1. **Set up MCP Server**: Create your Stellar MCP server
2. **Configure Tools**: Update the tool implementations
3. **Test Integration**: Test with testnet first
4. **Deploy**: Deploy to your preferred platform

## Support

For questions about:
- **Mastra Framework**: Check the [Mastra documentation](https://mastra.ai/docs)
- **Stellar Development**: Check the [Stellar documentation](https://developers.stellar.org/)
- **MCP Protocol**: Check the [MCP specification](https://spec.modelcontextprotocol.io/)

## Contributing

Feel free to contribute improvements to the Stellar agent implementation! 