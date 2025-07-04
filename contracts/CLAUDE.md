# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Stellar blockchain project containing smart contracts written in Rust using the Soroban SDK. The workspace consists of two main contracts:

1. **contacts** - A contact management system that allows users to store contacts and sponsor coffee payments
2. **coffee_sponsor** - A policy contract that validates coffee sponsorship transactions with security rules

## Build System

### Prerequisites
- Stellar CLI must be installed: `cargo install --locked stellar-cli`
- Rust with `wasm32-unknown-unknown` target

### Build Commands
- **Build all contracts**: `stellar contract build` (from workspace root)
- **Build script**: `./build.sh` - Automated build with error checking and success confirmation
- **Individual contract build**: Navigate to contract directory and run `stellar contract build`

### Test Commands
- **Run tests**: `cargo test` (from workspace root or individual contract directories)
- **Run specific test**: `cargo test test_name`

## Architecture

### Workspace Structure
- Root `Cargo.toml` defines workspace with shared dependencies
- Each contract has its own `Cargo.toml` and `src/` directory
- Common dependencies: `soroban-sdk` v22.0.0, `smart-wallet` and `smart-wallet-interface` from passkey-kit

### Contacts Contract (`contacts/src/lib.rs`)
- **Primary purpose**: Manages user contacts and handles coffee sponsorship payments
- **Key features**:
  - Per-user isolated contact storage using `(CONTACTS_PREFIX, user_address)` as storage key
  - Contact editing/deletion restrictions for sponsored contacts
  - Coffee sponsorship transfers 15 XLM (~$3-4 USD) to contacts
  - Address uniqueness validation within user's contact list
- **Main functions**:
  - `add_cont()`: Add contact (shortened name for policy validation)
  - `spon_coff()`: Sponsor coffee payment (shortened name for policy validation)
  - `edit_contact()`, `delete_contact()`: Modify contacts (blocked if sponsored)
  - `get_contact()`, `get_all_contacts()`: Read operations
- **Storage patterns**: Uses persistent storage with compound keys for multi-user isolation

### Coffee Sponsor Policy Contract (`coffe_sponsor/src/lib.rs`)
- **Primary purpose**: Validates coffee sponsorship transactions through smart wallet policy
- **Security rules**:
  - Wallet must be at least 24 hours old (17,280 ledgers)
  - Maximum 50 sponsorships per day per wallet
  - No duplicate sponsorships to same contact address
  - Only allows specific function calls: `add_cont` and `spon_coff`
- **Validation flow**: Extracts arguments from contract calls and validates against stored rules
- **Storage**: Tracks wallet ages, daily sponsorship counts, and sponsored contact pairs

### Integration Pattern
The contracts work together through Stellar's smart wallet system:
1. User calls `spon_coff()` on contacts contract
2. Smart wallet policy (`coffee_sponsor`) validates the transaction
3. If valid, XLM transfer executes and contact is marked as sponsored

## Development Notes

### Function Naming Convention
- Short function names (`add_cont`, `spon_coff`) are used for policy contract validation
- Policy contract expects specific function names and argument patterns

### Error Handling
- Contacts contract uses `panic!()` for user-facing errors
- Policy contract uses `panic_with_error!()` with custom error codes

### Testing
- Unit tests are in `contacts/src/test.rs`
- Tests cover multi-user isolation, CRUD operations, and edge cases
- Use `cargo test` to run all tests

### Deployment
- Contracts compile to WASM files in `target/wasm32-unknown-unknown/release/`
- Deploy using: `stellar contract deploy --wasm target/wasm32-unknown-unknown/release/stellar_contacts.wasm`
- Initialize contacts contract with native XLM token address