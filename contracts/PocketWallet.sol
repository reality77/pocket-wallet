// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

import "./PocketWalletFactory.sol";

struct PocketWalletReceipient {
    address receipient;
    string label;
}

contract PocketWallet {
    
    PocketWalletFactory _factory;
    address[] _controllers;
    mapping(address => uint32) private _controllersMap;

    uint256 constant GAS_MIN_THRESHOLD = 0.002 ether;
    uint256 constant GAS_SEND_MAX = 0.005 ether;

    address payable _user;

    PocketWalletReceipient[] _receipients;
    mapping(address => uint32) private _receipientIndexes;  // indexes starts at 1 because 0 is the default value

    constructor(address controller, address payable user) payable {
        _factory = PocketWalletFactory(msg.sender);
        _addControllerInternal(controller, true);
        _setUserInternal(user, true);
        _sendGasToUserIfNeeded();

        addReceipient(controller, "Daddy");
    }

    // Modifier to check that the caller is a controller of
    // the contract.
    modifier onlyController() {
        require(_controllersMap[msg.sender] == 1, "Not controller");
        _;
    }

   // Modifier to check that the caller is the user of
    // the contract.
    modifier onlyUser() {
        require(msg.sender == _user, "Not user");
        _;
    }

   // Modifier to check that the caller is a user or a controller of
    // the contract.
    modifier onlyUserOrControllerOrFactory() {
        require(msg.sender == _user || msg.sender == address(_factory) || _controllersMap[msg.sender] == 1, "Must be either user, controller or factory");
        _;
    }

    // Function for Ether deposits
    receive() external payable {}

    function _addControllerInternal(address controller, bool fromConstructor) private {
        _controllers.push(controller);
        _controllersMap[controller] = 1;

        if(!fromConstructor) {
            _factory.setController(controller);
        }
    }

    function register(address payable user) external onlyController {
        
        if(_user == address(0)) {
            _factory.removeUser(_user);
        }

        _setUserInternal(user, false);
        _sendGasToUserIfNeeded();
    }

    function addReceipient(address receipient, string memory label) public onlyUserOrControllerOrFactory  {
        require(_receipientIndexes[receipient] == 0, "Receipient already existing");
        _receipients.push(PocketWalletReceipient(receipient, label));
        _receipientIndexes[receipient] = uint32(_receipients.length);
    }

    function removeReceipient(address receipient) public onlyUserOrControllerOrFactory  {
        require(_receipientIndexes[receipient] > 0, "Receipient not found");

        uint32 index = _receipientIndexes[receipient] - 1;
        
        if (index != _receipients.length - 1) {
            PocketWalletReceipient memory swappedReceipient = _receipients[_receipients.length - 1];
            _receipients[index] = swappedReceipient;
            _receipientIndexes[swappedReceipient.receipient] = index;
        }

        _receipients.pop();

        delete _receipientIndexes[receipient];
    }

    function listReceipients() public view onlyUserOrControllerOrFactory returns (PocketWalletReceipient[] memory) {
        return _receipients;
    }
    
    function getUser() external view returns(address) {
        return _user;
    }

    function getControllers() external view returns(address[] memory) {
        return _controllers;
    }

    function _setUserInternal(address payable user, bool fromConstructor) private {
        _user  = user;

        if(!fromConstructor) {
            _factory.setUser(user);
        }
    }

    function spend(address receipient, uint256 amount) external onlyUser {
        require(amount < address(this).balance);

        // send ether to receipient
        (bool success, ) = receipient.call{value: amount}("");
        require(success, "Failed to send Ether");

        _sendGasToUserIfNeeded();
    }

    // Send gas to the user to ensure he can always call the contract
    function _sendGasToUserIfNeeded() private {
        if(_user.balance < GAS_MIN_THRESHOLD) {
            uint256 amount = GAS_SEND_MAX - _user.balance;

            (bool success, ) = _user.call{value: amount}("");
            require(success, "Failed to send Ether");
        }
    }
}
