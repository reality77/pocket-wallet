# Pocket wallet

The crypto wallet for children

## Hypothesis

- The child DApp will have a mnenonic or private key generated and a public address
- The amount of ETH in this address will remain low (gas spending only)
- If the mnemonic or private key is lost, the parent can register another one to let the child regain access to this contract wallet
- If the mnemonic or private key is hacked, the hacker can gain access to the contract amount until a parent locks it
  - Mitigations : put a limit to spending, put events so parents know when a spending has been proceeded

## Pre requisites

### Pocket wallets contracts factory

Purpose : Maps child account adresses with pocket wallet contract addresses
The contract factory address must be stored in the DApp source code directly

## Create pocket wallet

### [CHILD UI] Create pocket wallet

+ Open the app
+ Create pin and confirm
- generates child mnemonic (or private key) + child_account_address
+ Enter child first name
- generates salt from name and random
- store (local storage)
  * child name
  * salt
  * child_account_address
- store (local storage - encrypted with PIN + salt) :
  * child mnemonic (or private key)
+ Sends the child_account_address to parent (email ? link ? ...)
+ Wait for parent (pocket wallet contract registration) - polls factory every 10 seconds
+ [After parent registration]
  - finds contract_address from child_account_address
- store (local storage) :
  * contract_address


### [PARENT UI] Parent : New pocket wallet contract

+ Open the app
+ Connect existing browser wallet
+ [FACTORY] Create the pocket wallet contract ([optional] with salt)
  - parent address is <controller>
  - <controllers> maps parent address to the new contract address
+ [CONTRACT] Send ETH to contract
+ [CONTRACT] Register child account
  - child_account_address (becomes <user>)
  - [FACTORY] <users> maps child address to this contract address 
  - contract sends small amount to child account address (for gas spending only)
- store (local storage) :
  * contract_address

## CHILD UI

### Open App

+ Open the app
  - restore unencrypted stored local data
  - displays :
    * Balance (contract balance)

### Send ETH

+ Enter amount, target address and click Send
+ Enter PIN
  - decrypt mnemonic or private key from local storage
+ [CONTRACT] Call sendTo method
  - sends to target (if in limits allowed)
  - test child account balance. If minimum threshold reached, sends a little ETH to child account (for gas spending)

### [CHILD UI] OPTION : Export account data

Exports a file containing :
- child mnemonic or private key
- child account address
- contract address


### Recovery (child)

#### If mnemonic lost

Generate new child account address & re-register <user> in contract address
