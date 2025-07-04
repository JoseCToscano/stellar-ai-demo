#![cfg(test)]

use super::*;
use soroban_sdk::{symbol_short, testutils::Address as _, Address, Env, String};

#[test]
fn test_multi_user_isolation() {
    let env = Env::default();
    let contract_id = env.register_contract(None, ContactsContract);
    let client = ContactsContractClient::new(&env, &contract_id);

    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);
    let contact_address = Address::generate(&env);

    let alias = String::from_str(&env, "Mom");
    
    // User1 adds a contact
    let result1 = client.add_contact(&user1, &alias, &contact_address);
    assert!(result1);
    
    // User2 should not see User1's contacts
    let user2_contacts = client.get_all_contacts(&user2);
    assert_eq!(user2_contacts.len(), 0);
    
    // User1 should see their own contact
    let user1_contacts = client.get_all_contacts(&user1);
    assert_eq!(user1_contacts.len(), 1);
}

#[test]
fn test_add_contact() {
    let env = Env::default();
    let contract_id = env.register_contract(None, ContactsContract);
    let client = ContactsContractClient::new(&env, &contract_id);

    let user = Address::generate(&env);
    let contact_address = Address::generate(&env);

    let alias = String::from_str(&env, "Mom");
    let result = client.add_contact(&user, &alias, &contact_address);
    
    assert!(result);
    
    let contact = client.get_contact(&user, &alias).unwrap();
    assert_eq!(contact.alias, alias);
    assert_eq!(contact.address, contact_address);
}

#[test]
fn test_add_duplicate_contact() {
    let env = Env::default();
    let contract_id = env.register_contract(None, ContactsContract);
    let client = ContactsContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let contact_address = Address::generate(&env);

    client.initialize(&owner);

    let alias = String::from_str(&env, "Mom");
    
    // Add first contact
    let result1 = client.add_contact(&alias, &contact_address);
    assert!(result1);
    
    // Try to add duplicate contact
    let result2 = client.add_contact(&alias, &contact_address);
    assert!(!result2);
}

#[test]
fn test_edit_contact() {
    let env = Env::default();
    let contract_id = env.register_contract(None, ContactsContract);
    let client = ContactsContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let old_address = Address::generate(&env);
    let new_address = Address::generate(&env);

    client.initialize(&owner);

    let alias = String::from_str(&env, "Mom");
    
    // Add contact
    client.add_contact(&alias, &old_address);
    
    // Edit contact
    let result = client.edit_contact(&alias, &new_address);
    assert!(result);
    
    let contact = client.get_contact(&alias).unwrap();
    assert_eq!(contact.address, new_address);
}

#[test]
fn test_edit_nonexistent_contact() {
    let env = Env::default();
    let contract_id = env.register_contract(None, ContactsContract);
    let client = ContactsContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let new_address = Address::generate(&env);

    client.initialize(&owner);

    let alias = String::from_str(&env, "Nonexistent");
    
    // Try to edit nonexistent contact
    let result = client.edit_contact(&alias, &new_address);
    assert!(!result);
}

#[test]
fn test_delete_contact() {
    let env = Env::default();
    let contract_id = env.register_contract(None, ContactsContract);
    let client = ContactsContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let contact_address = Address::generate(&env);

    client.initialize(&owner);

    let alias = String::from_str(&env, "Mom");
    
    // Add contact
    client.add_contact(&alias, &contact_address);
    
    // Delete contact
    let result = client.delete_contact(&alias);
    assert!(result);
    
    // Verify contact is deleted
    let contact = client.get_contact(&alias);
    assert!(contact.is_none());
}

#[test]
fn test_delete_nonexistent_contact() {
    let env = Env::default();
    let contract_id = env.register_contract(None, ContactsContract);
    let client = ContactsContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);

    client.initialize(&owner);

    let alias = String::from_str(&env, "Nonexistent");
    
    // Try to delete nonexistent contact
    let result = client.delete_contact(&alias);
    assert!(!result);
}

#[test]
fn test_get_all_contacts() {
    let env = Env::default();
    let contract_id = env.register_contract(None, ContactsContract);
    let client = ContactsContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let address1 = Address::generate(&env);
    let address2 = Address::generate(&env);

    client.initialize(&owner);

    let alias1 = String::from_str(&env, "Mom");
    let alias2 = String::from_str(&env, "Dad");
    
    // Add contacts
    client.add_contact(&alias1, &address1);
    client.add_contact(&alias2, &address2);
    
    // Get all contacts
    let contacts = client.get_all_contacts();
    assert_eq!(contacts.len(), 2);
    
    // Verify contacts count
    let count = client.get_contacts_count();
    assert_eq!(count, 2);
}

#[test]
fn test_transfer_to_contact() {
    let env = Env::default();
    let contract_id = env.register_contract(None, ContactsContract);
    let client = ContactsContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let contact_address = Address::generate(&env);

    client.initialize(&owner);

    let alias = String::from_str(&env, "Mom");
    
    // Add contact
    client.add_contact(&alias, &contact_address);
    
    // Note: In a real test, you would need to mock the transfer functionality
    // For now, we just test that the function returns true for existing contacts
    let result = client.transfer_to_contact(&alias, &1000000i128); // 0.1 XLM in stroops
    assert!(result);
}

#[test]
fn test_transfer_to_nonexistent_contact() {
    let env = Env::default();
    let contract_id = env.register_contract(None, ContactsContract);
    let client = ContactsContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);

    client.initialize(&owner);

    let alias = String::from_str(&env, "Nonexistent");
    
    // Try to transfer to nonexistent contact
    let result = client.transfer_to_contact(&alias, &1000000i128);
    assert!(!result);
} 