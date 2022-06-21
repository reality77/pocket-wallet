// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./PocketWallet.sol";

contract PocketWalletFactory {

    mapping(address => address) private _controllersToContract;
    mapping(address => address) private _usersToContract;
    mapping(address => uint32) private _contractsMap;

    constructor() {
    }

    function setController(PocketWallet wallet, address controller) external {
        _controllersToContract[controller] = address(wallet);
    }

    function setUser(PocketWallet wallet, address user) external {
        _usersToContract[user] = address(wallet);
    }

    function removeUser(address user) external {
        delete _usersToContract[user];
    }

    function createPocketWallet(address user) external {
        PocketWallet wallet = new PocketWallet(msg.sender, user);
        _contractsMap[address(wallet)] = 1;
    }

}
