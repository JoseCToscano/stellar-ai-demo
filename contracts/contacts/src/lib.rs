#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, Map, String, Vec,
    token, symbol_short, Symbol
};

// Data types
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Contact {
    pub alias: String,
    pub address: Address,
    pub created_at: u64,
    pub updated_at: u64,
}

// Storage keys - each user gets their own contact storage
const CONTACTS_PREFIX: Symbol = symbol_short!("CONTACTS");
const SPONSORED_ALIASES_PREFIX: Symbol = symbol_short!("SPON_ALI");
const NATIVE_TOKEN_KEY: Symbol = symbol_short!("NATIVE");

// Fixed amount: 5 USD equivalent in XLM (approximately 50 XLM, adjust as needed)
// This is in stroops (1 XLM = 10,000,000 stroops)
const COFFEE_AMOUNT: i128 = 150_000_000; // 15 XLM ~ $3-4 USD at current price (0.24 USD per XLM)

#[contract]
pub struct ContactsContract;

#[contractimpl]
impl ContactsContract {
    /// Initialize the contract with the native XLM token address
    /// native_token_addr should be the address of the native XLM Stellar Asset Contract
    pub fn initialize(env: Env, native_token_addr: Address) {
        // Store the native token address for future use
        env.storage().instance().set(&NATIVE_TOKEN_KEY, &native_token_addr);
    }

    /// Get the stored native token address
    fn get_native_token_address(env: &Env) -> Address {
        env.storage().instance().get(&NATIVE_TOKEN_KEY).unwrap()
    }

    /// Get user's contacts storage key
    fn get_user_contacts_key(_user: &Address) -> Symbol {
        // Create a unique storage key for each user
        symbol_short!("CONTACTS")
    }

    /// Get user's contacts map
    fn get_user_contacts(env: &Env, user: &Address) -> Map<String, Contact> {
        let _key = Self::get_user_contacts_key(user);
        env.storage()
            .persistent()
            .get(&(CONTACTS_PREFIX, user))
            .unwrap_or(Map::new(env))
    }

    /// Save user's contacts map
    fn save_user_contacts(env: &Env, user: &Address, contacts: &Map<String, Contact>) {
        env.storage()
            .persistent()
            .set(&(CONTACTS_PREFIX, user), contacts);
    }

    /// Get user's sponsored aliases set
    fn get_user_sponsored_aliases(env: &Env, user: &Address) -> Map<String, bool> {
        env.storage()
            .persistent()
            .get(&(SPONSORED_ALIASES_PREFIX, user))
            .unwrap_or(Map::new(env))
    }

    /// Save user's sponsored aliases set
    fn save_user_sponsored_aliases(env: &Env, user: &Address, sponsored_aliases: &Map<String, bool>) {
        env.storage()
            .persistent()
            .set(&(SPONSORED_ALIASES_PREFIX, user), sponsored_aliases);
    }

    /// Check if a contact alias has been sponsored by a user
    fn is_contact_sponsored(env: &Env, user: &Address, alias: &String) -> bool {
        let sponsored_aliases = Self::get_user_sponsored_aliases(env, user);
        sponsored_aliases.contains_key(alias.clone())
    }

    /// Mark a contact alias as sponsored
    fn mark_contact_as_sponsored(env: &Env, user: &Address, alias: &String) {
        let mut sponsored_aliases = Self::get_user_sponsored_aliases(env, user);
        sponsored_aliases.set(alias.clone(), true);
        Self::save_user_sponsored_aliases(env, user, &sponsored_aliases);
    }

    /// Check if an address is already used by another contact (different alias)
    fn is_address_already_used(env: &Env, user: &Address, new_address: &Address, current_alias: &String) -> bool {
        let contacts = Self::get_user_contacts(env, user);
        let keys = contacts.keys();
        
        for i in 0..keys.len() {
            if let Some(alias) = keys.get(i) {
                // Skip the current alias we're checking (for edit scenarios)
                if alias == *current_alias {
                    continue;
                }
                
                if let Some(contact) = contacts.get(alias) {
                    if contact.address == *new_address {
                        return true; // Address is already used by another contact
                    }
                }
            }
        }
        false
    }

    /// Add a new contact (account can only add to their own contacts)
    pub fn add_cont(env: Env, account: Address, alias: String, address: Address) -> bool {
        // Require authentication from the account
        account.require_auth();

        let mut contacts = Self::get_user_contacts(&env, &account);

        // Check if alias already exists for this user
        if contacts.contains_key(alias.clone()) {
            panic!("Contact alias already exists: {:?}", alias);
        }

        // Check if address is already used by another contact
        if Self::is_address_already_used(&env, &account, &address, &alias) {
            panic!("Address already used by another contact: {:?}", address);
        }

        let current_time = env.ledger().timestamp();
        let contact = Contact {
            alias: alias.clone(),
            address,
            created_at: current_time,
            updated_at: current_time,
        };

        contacts.set(alias, contact);
        Self::save_user_contacts(&env, &account, &contacts);
        true
    }

    /// Edit an existing contact (account can only edit their own contacts)
    /// Cannot edit contacts that have already been sponsored
    pub fn edit_contact(env: Env, account: Address, alias: String, new_address: Address) -> bool {
        account.require_auth();

        // Check if this contact has been sponsored - if so, prevent editing
        if Self::is_contact_sponsored(&env, &account, &alias) {
            panic!("Cannot edit sponsored contact: {:?}", alias);
        }

        // Check if the new address is already used by another contact
        if Self::is_address_already_used(&env, &account, &new_address, &alias) {
            panic!("Address already used by another contact: {:?}", new_address);
        }

        let mut contacts = Self::get_user_contacts(&env, &account);

        if let Some(mut contact) = contacts.get(alias.clone()) {
            contact.address = new_address;
            contact.updated_at = env.ledger().timestamp();
            contacts.set(alias, contact);
            Self::save_user_contacts(&env, &account, &contacts);
            true
        } else {
            false // Contact not found - this is a legitimate "not found" scenario
        }
    }

    /// Delete a contact (account can only delete their own contacts)
    /// Cannot delete contacts that have already been sponsored
    pub fn delete_contact(env: Env, account: Address, alias: String) -> bool {
        account.require_auth();

        // Check if this contact has been sponsored - if so, prevent deletion
        if Self::is_contact_sponsored(&env, &account, &alias) {
            panic!("Cannot delete sponsored contact: {:?}", alias);
        }

        let mut contacts = Self::get_user_contacts(&env, &account);

        if contacts.contains_key(alias.clone()) {
            contacts.remove(alias);
            Self::save_user_contacts(&env, &account, &contacts);
            true
        } else {
            false
        }
    }

    /// Get a specific contact by alias (account can only read their own contacts)
    pub fn get_contact(env: Env, account: Address, alias: String) -> Option<Contact> {
        let contacts = Self::get_user_contacts(&env, &account);
        contacts.get(alias)
    }

    /// Get all contacts for the account (account can only read their own contacts)
    pub fn get_all_contacts(env: Env, account: Address) -> Vec<Contact> {
        let contacts = Self::get_user_contacts(&env, &account);

        let mut result = Vec::new(&env);
        let keys = contacts.keys();
        
        for i in 0..keys.len() {
            if let Some(key) = keys.get(i) {
                if let Some(contact) = contacts.get(key) {
                    result.push_back(contact);
                }
            }
        }
        
        result
    }

    /// Get total number of contacts for the account
    pub fn get_contacts_count(env: Env, account: Address) -> u32 {
        let contacts = Self::get_user_contacts(&env, &account);
        contacts.len()
    }

    /// Sponsor coffee by sending XLM equivalent to $5 USD to a contact
    /// Function will be called through a smart wallet with coffee sponsor policy attached
    /// Policy expects args: sponsor (Address), contact_alias (String)
    pub fn spon_coff(env: Env, sponsor: Address, contact_alias: String) -> bool {
        // 1. Require authentication from sponsor
        sponsor.require_auth();

        // 2. Get sponsor's contacts and find the specified contact
        let contacts = Self::get_user_contacts(&env, &sponsor);
        let contact = match contacts.get(contact_alias.clone()) {
            Some(contact) => contact,
            None => return false, // Contact not found
        };

        // 3. The policy contract will validate this call with:
        //    args[0] = sponsor, args[1] = contact_alias
        //    Policy checks: wallet age (24h), daily limits (50/day), no duplicates per alias

        // 4. Transfer native XLM from sponsor to contact address
        //    Use the stored native token address from initialization
        let native_token_address = Self::get_native_token_address(&env);
        let token_client = token::Client::new(&env, &native_token_address);
        
        // Transfer native XLM (no trustlines required for native assets)
        token_client.transfer(&sponsor, &contact.address, &COFFEE_AMOUNT);

        // 5. Mark this contact as sponsored to prevent future edits/deletes
        Self::mark_contact_as_sponsored(&env, &sponsor, &contact_alias);

        // 6. Return success
        true
    }

    /// Get the current coffee sponsorship amount in stroops (XLM)
    pub fn get_coffee_amount() -> i128 {
        COFFEE_AMOUNT
    }

    /// Check if a contact has been sponsored (public function for frontend use)
    pub fn is_contact_sponsored_by_user(env: Env, user: Address, alias: String) -> bool {
        Self::is_contact_sponsored(&env, &user, &alias)
    }

    /// Get all sponsored aliases for a user
    pub fn get_sponsored_aliases(env: Env, user: Address) -> Vec<String> {
        let sponsored_aliases = Self::get_user_sponsored_aliases(&env, &user);
        
        let mut result = Vec::new(&env);
        let keys = sponsored_aliases.keys();
        
        for i in 0..keys.len() {
            if let Some(key) = keys.get(i) {
                result.push_back(key);
            }
        }
        
        result
    }

    /// Check if an address is already used by any contact for this user (public function for frontend use)
    pub fn is_address_used(env: Env, user: Address, address: Address) -> bool {
        let empty_alias = String::from_str(&env, "");
        Self::is_address_already_used(&env, &user, &address, &empty_alias)
    }

    /// Find which alias is using a specific address (returns empty string if not found)
    pub fn find_alias_by_address(env: Env, user: Address, address: Address) -> String {
        let contacts = Self::get_user_contacts(&env, &user);
        let keys = contacts.keys();
        
        for i in 0..keys.len() {
            if let Some(alias) = keys.get(i) {
                if let Some(contact) = contacts.get(alias.clone()) {
                    if contact.address == address {
                        return alias;
                    }
                }
            }
        }
        
        String::from_str(&env, "") // Return empty string if not found
    }
}

mod test; 