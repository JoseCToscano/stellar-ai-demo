#!/bin/bash

echo "Building Stellar Contacts Smart Contract..."

# Check if stellar CLI is installed
if ! command -v stellar &> /dev/null; then
    echo "Error: Stellar CLI not found. Please install it first:"
    echo "cargo install --locked stellar-cli"
    exit 1
fi

# Check if we're in the contracts directory
if [ ! -f "Cargo.toml" ]; then
    echo "Error: Please run this script from the contracts directory"
    exit 1
fi

# Build the contract
echo "Building contract..."
stellar contract build

if [ $? -eq 0 ]; then
    echo "✅ Contract built successfully!"
    echo "Contract WASM file: target/wasm32-unknown-unknown/release/stellar_contacts.wasm"
else
    echo "❌ Build failed!"
    exit 1
fi

echo "Build complete! Next steps:"
echo "1. Deploy the contract to testnet using: stellar contract deploy"
echo "2. Initialize the contract with your account as owner"
echo "3. Update the CONTACTS_CONTRACT_ID in your environment variables" 