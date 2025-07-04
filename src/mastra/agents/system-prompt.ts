export const systemPrompt = `
Stellar AI Agent Kit: Enabling Safe AI Integration with Soroban Smart Contracts

Introduction
As artificial intelligence continues to permeate every aspect of modern software development, it is clear that the next wave of dApps will be powered by autonomous agents capable of reading data, making decisions, and executing transactions across the decentralized web. Stellar, with its fast finality, low fees, and developer-first infrastructure, is well-positioned to become the blockchain of choice for this new generation of AI-native applications.
The Stellar AI Agent Kit is an open-source project that enables AI Agents to safely interact with Soroban smart contracts through Model Context Protocol (MCP) Servers and Policy Signers. This document explains the motivations, architecture, technical components, security model, and vision behind the project.
Why This Matters for Stellar
Stellar has consistently led efforts to improve financial access and infrastructure. As more developers shift to AI-native development models, the demand for agent-friendly blockchain infrastructure will explode. Stellar can be at the forefront of this movement by offering:
Secure access controls via Policy Signers
Simple smart wallet integration through Passkeys
Structured interfaces for tools through MCP Servers
Open-source SDKs and examples to onboard new devs
The Stellar AI Agent Kit bridges the gap between AI agent frameworks and Soroban smart contracts, enabling:
Developer onboarding via simplified SDKs and playgrounds
Safe automation of contract interactions
Support for non-custodial execution models (agents without holding private keys)
A competitive edge in attracting AI-driven projects to build on Stellar
Core Concepts
1. Model Context Protocol (MCP)
MCP is an emerging standard for enabling LLM-based agents to interact with tools via structured, interpretable interfaces. In the Stellar context, MCP Servers expose contract methods as callable functions with:
JSON schemas for inputs/outputs
Descriptions and examples for each function
A way to return unsigned transactions (XDRs) for client-side signing
Each MCP Server acts as a secure bridge between AI agents and on-chain logic.
2. Policy Signers
Policy Signers are smart contracts on Soroban that control access to signing authority for other contracts or accounts. They enable rule-based delegation, where an agent or tool can:
Be authorized to sign transactions
Only under defined conditions (e.g., specific function, contract, params)
Without holding private keys or full access to an account
This introduces a secure, programmable trust layer perfect for AI interactions.
3. Passkeys & Smart Wallets
Passkeys enable the creation of smart wallets (contract-controlled accounts) tied to a user's domain and device.
Built-in support for WebAuthn biometric login
No seed phrases or private keys needed
Work natively with Policy Signers
Passkeys are ideal for consumer-facing dApps, while Policy Signers support automation, delegation, and multi-agent systems.
Architecture Overview

┌──────────────┐
│   AI Agent   │
└─────┬────────┘
      │ Calls MCP tool
┌─────▼────────┐                ┌──────────────────────────┐
│ MCP Server   ├───────────────► Tool Schema / API Layer   │
└─────┬────────┘                └──────────────────────────┘
      │ returns unsigned XDR
┌─────▼────────┐
│   Agent SDK  │ (or User Wallet)
└─────┬────────┘
      │ signs if policy allows
┌─────▼────────┐
│ PolicySigner │ (contract)
└─────┬────────┘
      │ executes if valid
┌─────▼────────┐
│  Soroban SC  │
└──────────────┘

Features of the AI Agent Kit

🔧 MCP Server Generator

CLI that transforms a Soroban WASM contract into a typed MCP Server

Includes auto-generated JSON schemas, sample inputs, output interpreters

Generates secure backend code in TypeScript for unsigned transaction generation

🛡️ Policy Signer Generator

CLI to define and deploy Policy Signers from a contract interface
Expressive rules like:
only allow transfer_to_contact if amount <= $5
only call method X if from IP Y

🧠 AI Routing & Prompt Agents
Example integration with Claude, GPT-4, and function calling
Prototypes for:
Transaction approval agents
AI-onboarding assistants
MCP tool routers
🔐 Passkey & Smart Wallet SDK
Built-in support for WebAuthn
Biometric or system key login
Client-side signing of unsigned XDRs
Account recovery options

🌐 Playground and Examples

Hosted sandbox for trying out:
MCP contracts
Policy Signers
AI workflows
Common Questions & Concerns

❓ Why not just use traditional wallets or private key signing?

AI agents should not hold private keys. It's unsafe, brittle, and hard to audit. Policy Signers enable scoped delegation and full traceability. With Passkeys, users get secure biometric login without key management.

❓ Can AI agents drain my wallet?

Not if you use Policy Signers. You can define strict rules. For example: allow only one coffee transfer per day under $5. Everything else is rejected by the contract itself.

❓ Is this production-ready?

Parts of it are already in use in production apps. Policy Signers are a powerful but emerging primitive. Our kit includes robust tooling and examples to accelerate adoption.

❓ What if I don’t use AI Agents?

You can still use Policy Signers for multisig, parental controls, DAO permissions, etc. This kit is designed to serve AI-first, but works across broader contexts.

❓ How does this align with Stellar’s vision?

This unlocks a new generation of apps:

Wallets with AI-guided onboarding

Agents managing DeFi positions

Fraud detection and compliance bots

Payment automation

It brings more developers, use cases, and user trust into the ecosystem.

The Bigger Picture: AI x Web3

AI is the new frontend.
Blockchain is the new backend.
Stellar can be the bridge.

By embracing AI-native design, Stellar has a unique opportunity:

To become the chain of choice for autonomous agents

To define standards for safe and auditable agent execution

To onboard new developers from both AI and blockchain backgrounds

Roadmap
Launch v1 of Kit (Complete)
CLI generators for MCP + Policy Signers
Working demos with contracts
Passkey integration
Standardization Phase
Draft SEP for MCP Tool schema
Shared metadata across AI contracts
DevRel collaboration
Ecosystem Demos
Hackathon-ready starter kits
Grants for AI agents
Production Use Cases

Automated agents managing assets

Passkey-native consumer wallets

Business automation (e.g. reminders, accounting agents)

Get Involved
Playground: https://stellarsandbox.dev/

Contributions welcome. Let’s build the future of AI x Stellar together.

Final Thought

AI will move money. The only question is how.
With the Stellar AI Agent Kit, we are building the tools to make sure it’s done safely, transparently, and with user consent.

Policy Signers unlock the power of smart wallets.
MCP Servers give agents safe rails to act.
Together, they prepare Stellar for the AI-native future.`