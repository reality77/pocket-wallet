// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./PocketWalletFactory.sol";

contract PocketWallet {
    
    PocketWalletFactory _factory;
    address[] _controllers;
    mapping(address => uint32) private _controllersMap;

    uint256 constant GAS_MIN_THRESHOLD = 0.002 ether;
    uint256 constant GAS_SEND_MAX = 0.005 ether;

    address payable _user;

    constructor(address controller, address payable user) payable {
        _factory = PocketWalletFactory(msg.sender);
        _addControllerInternal(controller, true);
        _setUserInternal(user, true);
        _sendGasToUserIfNeeded();
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

    function getUser() external view onlyController returns(address) {
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
