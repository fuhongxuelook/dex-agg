// SPDX-License-Identifier: GPL-3.0
/**
 * @dev receive token from sender;
 * do some helpful method, like pause, set perform address
 */

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Libraries/Constants.sol";
import "./AdapterManage.sol";
import "./Performer.sol";
import "./Libraries/TransferHelper.sol";
import "./Interface/SwapInterface.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract SwapTransparent is SwapInterface, 
                            Initializable, 
                            AdapterManage, 
                            PausableUpgradeable, 
                            ReentrancyGuardUpgradeable  {    

    PerformerInterface public performer;
    
    using TransferHelper for address;

    function initialize(address _performer) external initializer {
        __Ownable_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        performer = PerformerInterface(_performer);
    }

    /**
     * @dev See SwapInterface - swap
     * 
     * collect from token (or ether) from msg.sender
     * send token(ether) to performer address
     * execute swap by many aggregotor 
     * 
     * Requirements:
     *
     * - aggregatorId must be registered.
     * - we not check allowance for saving gas, but msg.sender must approve enough allownance
     * - perform must return true
     */
    function swap(
        uint aggregatorIndex,
        address tokenFrom,
        address tokenTo,
        uint256 amount,
        bytes calldata data
    ) external payable override whenNotPaused nonReentrant {

        // get router by register index
        AdapterSet.Adapter memory adapter = getAdapterByIndex(aggregatorIndex);

        require(adapter._router != address(0), "ERROR: aggregatorIndex not exists");

        // save gas
        address recipient = msg.sender;

        if (tokenFrom != Constants.ETH) {
            // not check allowance  for save gas
            // if allowance is not enough,
            // will be revert
            // use call for not standard erc20 and save gas
            tokenFrom.safeTransferFrom(recipient, address(performer), amount);
        } 

        bool b = performer.perform{value: msg.value}(
            tokenFrom,
            tokenTo,
            amount,
            recipient,
            adapter,
            data
        );
        require(b, "ERROR: Swap ERROR");

        emit Swap(aggregatorIndex, tokenFrom, tokenTo, recipient, amount, block.timestamp);

    }

    /**
     * @dev See SwapInterface - setPerformer
     * 
     * Requirements:
     * - performer neq newPerformmer
     */ 
    function setPerformer(address newPerformer) external override onlyOwner {
        require(address(performer) != newPerformer, "Error: Same Address");

        emit SetPerform(address(performer), newPerformer, block.timestamp);

        performer = PerformerInterface(newPerformer);
    }

    /**
     * @dev pause swap contract
     * 
     * Requirements
     * - onlyOwner
     * - whenNotPaused
     */ 
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev unpause swap contract
     * 
     * Requirements
     * - onlyOwner
     * - whenNotPaused
     */ 
    function unpause() external onlyOwner {
        _unpause();
    }

    receive() external payable {} 

}