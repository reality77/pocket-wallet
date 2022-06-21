// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./PocketWallet.sol";

contract PocketWalletFactory {

    mapping(address => address) private _controllersToContract;
    mapping(address => address) private _usersToContract;
    mapping(address => uint32) private _contractsMap;

    constructor() {
    }

    function setController(address controller) external {
        require(_contractsMap[msg.sender] > 0, "Pocket wallet is not registered in factory"); // ensures the pocket wallet contract (= sender) has been created from this factory
        _controllersToContract[controller] = msg.sender;
    }

    function setUser(address user) external {
        require(_contractsMap[msg.sender] > 0, "Pocket wallet is not registered in factory"); // ensures the pocket wallet contract (= sender) has been created from this factory
        _usersToContract[user] = msg.sender;
    }

    function removeUser(address user) external {
        require(_contractsMap[msg.sender] > 0, "Pocket wallet is not registered in factory"); // ensures the pocket wallet contract (= sender) has been created from this factory
        delete _usersToContract[user];
    }

    function createPocketWallet(address user) external {
        PocketWallet wallet = new PocketWallet(msg.sender, user);
        _contractsMap[address(wallet)] = 1;
        _controllersToContract[msg.sender] = address(wallet);
        _usersToContract[user] = address(wallet); 
    }

    function getUserContractAddress(address user) external view returns (address) {
        return _usersToContract[user];
    }

    function getMyControlledContractAddress() external view returns (address) {
        return _controllersToContract[msg.sender];

    }
}
