# Stellar Contacts Smart Contract System

A comprehensive Stellar blockchain system for managing contacts with human-readable aliases mapped to Stellar addresses. Built with Soroban smart contracts and integrated with the Mastra framework.

## 🌟 Features

- **Add Contact**: Store a new contact with an alias (e.g., "Mom") and Stellar address
- **Edit Contact**: Update an existing contact's Stellar address
- **Delete Contact**: Remove a contact from your address book
- **Get Contact**: Retrieve a specific contact by alias
- **Get All Contacts**: List all your stored contacts
- **Transfer to Contact**: Send XLM to a contact using their alias instead of the full address

## 📁 Project Structure

```
stellar-ai-demo/
├── contracts/                          # Soroban smart contract
│   ├── src/
│   │   ├── lib.rs                     # Main contract implementation
│   │   └── test.rs                    # Contract tests
│   ├── Cargo.toml                     # Rust dependencies
│   └── build.sh                       # Build script
├── src/mastra/
│   ├── tools/
│   │   └── stellar-contacts-tools.ts  # Mastra integration tools
│   ├── workflows/
│   │   └── contacts-workflow.ts       # Contact workflows
│   └── agents/
│       └── stellar-agent.ts           # AI agent with Stellar capabilities
└── CONTACTS_README.md                 # This file
```

## 🏗️ Architecture

### Smart Contract Layer (Soroban)
- **Language**: Rust
- **Platform**: Stellar Soroban
- **Storage**: Persistent storage for contact mappings
- **Security**: Owner-only operations with authentication

### Integration Layer (Mastra)
- **Tools**: TypeScript functions that interact with the smart contract
- **Workflows**: Orchestrated sequences of contact operations
- **Agent**: AI assistant that can execute contact operations

### Data Structure
```rust
pub struct Contact {
    pub alias: String,        // Human-readable name (e.g., "Mom")
    pub address: Address,     // Stellar address (56-char string starting with 'G')
    pub created_at: u64,      // Timestamp when contact was created
    pub updated_at: u64,      // Timestamp when contact was last updated
}
```

## 🚀 Getting Started

### Prerequisites

1. **Rust & Cargo**: For building the smart contract
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Stellar CLI**: For deploying and interacting with contracts
   ```bash
   cargo install --locked stellar-cli
   ```

3. **Node.js**: For the Mastra integration
   ```bash
   # Already installed based on your package.json
   ```

### Building the Smart Contract

1. Navigate to the contracts directory:
   ```bash
   cd contracts
   ```

2. Run the build script:
   ```bash
   chmod +x build.sh
   ./build.sh
   ```

3. Or build manually:
   ```bash
   stellar contract build
   ```

### Testing the Smart Contract

```bash
cd contracts
cargo test
```

### Deploying to Testnet

1. **Generate a keypair** (if you don't have one):
   ```bash
   stellar keys generate --global your-key-name --network testnet
   ```

2. **Fund your account**:
   ```bash
   stellar keys fund your-key-name --network testnet
   ```

3. **Deploy the contract**:
   ```bash
   stellar contract deploy \
     --wasm target/wasm32-unknown-unknown/release/stellar_contacts.wasm \
     --source-account your-key-name \
     --network testnet
   ```

4. **Initialize the contract**:
   ```bash
   stellar contract invoke \
     --id CONTRACT_ID \
     --source-account your-key-name \
     --network testnet \
     -- initialize \
     --owner YOUR_STELLAR_ADDRESS
   ```

## 📋 Usage Examples

### Using the Smart Contract Directly

1. **Add a contact**:
   ```bash
   stellar contract invoke \
     --id CONTRACT_ID \
     --source-account your-key-name \
     --network testnet \
     -- add_contact \
     --alias "Mom" \
     --address "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
   ```

2. **Get all contacts**:
   ```bash
   stellar contract invoke \
     --id CONTRACT_ID \
     --source-account your-key-name \
     --network testnet \
     -- get_all_contacts
   ```

3. **Transfer to a contact**:
   ```bash
   stellar contract invoke \
     --id CONTRACT_ID \
     --source-account your-key-name \
     --network testnet \
     -- transfer_to_contact \
     --alias "Mom" \
     --amount 1000000  # 0.1 XLM in stroops
   ```

### Using the Mastra Integration

The Mastra tools and workflows provide a higher-level interface:

```typescript
import { addContactStep } from './src/mastra/tools/stellar-contacts-tools';

// Add a contact
const result = await addContactStep.execute({
  inputData: {
    alias: "Mom",
    address: "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  }
});
```

### Using with the AI Agent

The Stellar agent can execute contact operations through natural language:

```
"Add Mom's Stellar address: GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
"Transfer 5 XLM to Mom"
"Show me all my contacts"
"Delete the contact named Alice"
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```bash
DATABASE_URL=your_database_url
ANTHROPIC_API_KEY=your_anthropic_key
CONTACTS_CONTRACT_ID=your_deployed_contract_id
NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
RPC_URL=https://soroban-testnet.stellar.org
```

### Contract Configuration

Update the contract ID in `src/mastra/tools/stellar-contacts-tools.ts`:

```typescript
const CONTACTS_CONTRACT_ID = process.env.CONTACTS_CONTRACT_ID || 'your-contract-id';
```

## 🧪 Available Operations

### Smart Contract Functions

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `initialize` | Set up the contract with owner | `owner: Address` | `void` |
| `add_contact` | Add a new contact | `alias: String, address: Address` | `bool` |
| `edit_contact` | Update contact address | `alias: String, new_address: Address` | `bool` |
| `delete_contact` | Remove a contact | `alias: String` | `bool` |
| `get_contact` | Get specific contact | `alias: String` | `Option<Contact>` |
| `get_all_contacts` | Get all contacts | `void` | `Vec<Contact>` |
| `transfer_to_contact` | Send XLM to contact | `alias: String, amount: i128` | `bool` |
| `get_owner` | Get contract owner | `void` | `Address` |
| `get_contacts_count` | Get total contacts | `void` | `u32` |

### Mastra Steps

- `addContactStep`
- `editContactStep`
- `deleteContactStep`
- `getContactStep`
- `getAllContactsStep`
- `transferToContactStep`

### Mastra Workflows

- `addContactWorkflow`
- `editContactWorkflow`
- `deleteContactWorkflow`
- `getContactWorkflow`
- `getAllContactsWorkflow`
- `transferToContactWorkflow`

## 🔒 Security Features

- **Owner-only operations**: Only the contract owner can modify contacts
- **Input validation**: Stellar addresses are validated (56 chars, starts with 'G')
- **Duplicate prevention**: Cannot add contacts with existing aliases
- **Safe transfers**: Transfers only occur to valid, existing contacts

## 🐛 Troubleshooting

### Common Issues

1. **Build fails**: Ensure Rust and stellar-cli are properly installed
2. **Deployment fails**: Check that your account has enough XLM for fees
3. **Contract not found**: Verify the CONTRACT_ID is correct
4. **Permission denied**: Ensure you're using the owner account for operations

### Debugging

1. **Check contract logs**:
   ```bash
   stellar contract invoke --id CONTRACT_ID --source-account your-key-name --network testnet -- get_owner
   ```

2. **Verify contract state**:
   ```bash
   stellar contract invoke --id CONTRACT_ID --source-account your-key-name --network testnet -- get_contacts_count
   ```

## 🚧 Development Status

This system is currently set up with mock implementations for demonstration purposes. To use with real Stellar contracts:

1. Deploy the smart contract to testnet/mainnet
2. Replace mock functions in `stellar-contacts-tools.ts` with actual Stellar SDK calls
3. Configure proper authentication and key management
4. Add error handling for network operations

## 📚 Additional Resources

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Smart Contracts](https://soroban.stellar.org/)
- [Mastra Framework](https://mastra.ai/)
- [Stellar CLI Reference](https://developers.stellar.org/docs/tools/stellar-cli)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is part of the stellar-ai-demo and follows the same license terms. 