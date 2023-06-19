// SPDX-License-Identifier: GPL-3.0
/**
 * @dev multisig for commitee to do some critical transaction
 * 
 * like set performer address and set feeTo address
 */

pragma solidity ^0.8.0;

import "./Interface/MultiSigInterface.sol";
import "./Interface/SwapInterface.sol";
import "./Interface/FeeToInterface.sol";
import "./Interface/AdapterManageInterface.sol";
import "./Interface/OwnerInterface.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";


contract MultiSig is  MultiSigInterface, EIP712Upgradeable, OwnableUpgradeable, UUPSUpgradeable {    

    using AddressUpgradeable for address;

    // minimal signature number
    uint256 sigsMin;

    // committee for signature
    mapping(address => bool) commitee;

    uint256 public nonces;

    // SetPerformer(address swap,address performer,uint256 chainId,uint256 nonce,uint256 deadline)
    // type struct
    // there are not space after comma
    // to guarentee runing on right chain, we neeed chainId,
    // nonce to prevert reentenry call, must need a nonce
    // deadline to guarentee the signatrue is time limited
    // this contract execute not frequently, so, choose original code 

    // keccak256("SetPerformer(address swap,address performer,uint256 chainId,uint256 nonce,uint256 deadline)");
    // 0x29570a74fc215c30669309b6ab3fd6bfc183f0b11360dd0a16f7b9caa246908f
    bytes32 constant TypeSetPerformerHash = 0x29570a74fc215c30669309b6ab3fd6bfc183f0b11360dd0a16f7b9caa246908f;

    // SetFeeTo(address performer,address feeTo,uint256 chainId,uint256 nonce,uint256 deadline)
    // type struct
    // keccak256("SetFeeTo(address performer,address feeTo,uint256 chainId,uint256 nonce,uint256 deadline)");
    // 0x347121c6281ff657d180ee48d2f8ef60b2fc42d3a65bb29b0f383fed46471f39
    bytes32 constant TypeSetFeeToHash = 0x347121c6281ff657d180ee48d2f8ef60b2fc42d3a65bb29b0f383fed46471f39;

    // SetFeeRate(address performer,uint256 feeRate,uint256 chainId,uint256 nonce,uint256 deadline)
    // type struct
    // keccak256("SetFeeRate(address performer,uint256 feeRate,uint256 chainId,uint256 nonce,uint256 deadline)");
    // 0x5f1ba42d59312596efd461ad7b4a7e373fd3d3a10c3e69fe17fd27f053a17458
    bytes32 constant TypeSetFeeRateHash = 0x5f1ba42d59312596efd461ad7b4a7e373fd3d3a10c3e69fe17fd27f053a17458;

    // TransferOwner(address ownerContract,address newOwner,uint256 chainId,uint256 nonce,uint256 deadline)
    // type struct
    // keccak256("TransferOwner(address ownerContract,address newOwner,uint256 chainId,uint256 nonce,uint256 deadline)");
    // 0xc1f779e5a791decdc33abca8b31ea84a45395e053f13297cbf2b7c2a03edcad5
    bytes32 constant TypeTransferOwnerHash = 0xc1f779e5a791decdc33abca8b31ea84a45395e053f13297cbf2b7c2a03edcad5;

    // FunctionCall(address theContract,bytes32 bytecodeHash,uint256 chainId,uint256 nonce,uint256 deadline)
    // type struct
    // keccak256("FunctionCall(address theContract,bytes32 bytecodeHash,uint256 chainId,uint256 nonce,uint256 deadline)");
    // 0x62d993eb7054d9a416e2938b405af11dc2622c21a603e17677a4eae94bb42ae3
    bytes32 constant TypeFunctionCallHash = 0x62d993eb7054d9a416e2938b405af11dc2622c21a603e17677a4eae94bb42ae3;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() external initializer {
        __Ownable_init();
        __EIP712_init("SAVI", "1.0");

        sigsMin = 3;
    }

    /**
     * @dev See MultiSigInterface - setPerformBySigs
     * 
     * Requirements:
     * - sigs number must large sigsMin
     * - dealline less than block timestamp
     * - signature address must equal recoverred address
     * - signature address must belongs to commitee
     */ 
    function setPerformBySigs(
        Signature[] calldata sigs, 
        address swap,
        address newPerformer, 
        uint256 deadline
        ) external override {
        
        require(deadline >= block.timestamp, "Error: signatrue is timeout");

        // genetate struct data hash
        bytes32 typeDataHash = keccak256(abi.encode(TypeSetPerformerHash, swap, newPerformer, block.chainid, nonces++, deadline));

        // hash Type data
        bytes32 hashedTypeData = _hashTypedDataV4(typeDataHash);

        _checkSigsByteTypedDataHash(sigs, hashedTypeData);

        SwapInterface(swap).setPerformer(newPerformer);

    }

    /**
     * @dev See MultiSigInterface - setFeeToBySigs
     * 
     * Requirements:
     * - sigs number must large sigsMin
     * - dealline less than block timestamp
     * - signature address must equal recoverred address
     * - signature address must belongs to commitee
     */ 
    function setFeeToBySigs(
        Signature[] calldata sigs, 
        address performer,
        address newFeeTo, 
        uint256 deadline
        ) external override {
        
        require(deadline >= block.timestamp, "Error: signatrue is timeout");

        // genetate struct data hash
        bytes32 typeDataHash = keccak256(abi.encode(TypeSetFeeToHash, performer, newFeeTo, block.chainid, nonces++, deadline));

        // hash Type data
        bytes32 hashedTypeData = _hashTypedDataV4(typeDataHash);

         _checkSigsByteTypedDataHash(sigs, hashedTypeData);

        FeeToInterface(performer).setFeeTo(payable(newFeeTo));
    }

    /**
     * @dev See MultiSigInterface - setFeeRateBySigs
     * 
     * Requirements:
     * - sigs number must large sigsMin
     * - dealline less than block timestamp
     * - signature address must equal recoverred address
     * - signature address must belongs to commitee
     */ 
    function setFeeRateBySigs(
        Signature[] calldata sigs, 
        address performer,
        uint256 newFeeRate, 
        uint256 deadline
        ) external override {
        
        require(deadline >= block.timestamp, "Error: signatrue is timeout");

        // genetate struct data hash
        bytes32 typeDataHash = keccak256(abi.encode(TypeSetFeeRateHash, performer, newFeeRate, block.chainid, nonces++, deadline));

        // hash Type data
        bytes32 hashedTypeData = _hashTypedDataV4(typeDataHash);

         _checkSigsByteTypedDataHash(sigs, hashedTypeData);

        FeeToInterface(performer).setFeeRate(newFeeRate);
    }

    /**
     * @dev See MultiSigInterface - checkSetFeeToSigs
     * 
     * Requirements:
     * - sigs number must large sigsMin
     * - dealline less than block timestamp
     * - signature address must equal recoverred address
     * - signature address must belongs to commitee
     */ 
    function transferContractOwnerBySigs(
        Signature[] calldata sigs, 
        address ownerContract,
        address newOwner, 
        uint256 deadline
        ) external override {
        
        require(deadline >= block.timestamp, "Error: signatrue is timeout");

        // genetate struct data hash
        bytes32 typeDataHash = keccak256(abi.encode(TypeTransferOwnerHash, ownerContract, newOwner, block.chainid, nonces++, deadline));

        // hash Type data
        bytes32 hashedTypeData = _hashTypedDataV4(typeDataHash);

         _checkSigsByteTypedDataHash(sigs, hashedTypeData);

        OwnerInterface(ownerContract).transferOwnership(newOwner);
    }

    function functionCallBySigs(
        Signature[] calldata sigs, 
        address theContract,
        bytes calldata bytecode, 
        uint256 deadline
        ) external override {

        require(deadline >= block.timestamp, "Error: signatrue is timeout");

        // genetate struct data hash
        bytes32 typeDataHash = keccak256(abi.encode(TypeFunctionCallHash, theContract, keccak256(bytecode), block.chainid, nonces++, deadline));

        // hash Type data
        bytes32 hashedTypeData = _hashTypedDataV4(typeDataHash);

         _checkSigsByteTypedDataHash(sigs, hashedTypeData);

        theContract.functionCall(bytecode);
    }

    /**
     * @dev check signatrues
     * 
     * Requirements:
     * - sigs number must large sigsMin
     * - signature address must equal recoverred address
     * - signature address must belongs to commitee
     */ 
    function _checkSigsByteTypedDataHash(Signature[] calldata sigs, bytes32 typedDataHash) private view {
        uint256 sigsLength = sigs.length;
        require(sigsLength >= sigsMin, "Error: sigs number must exceed minimum");

        address lastAddress;
        for(uint256 i; i < sigsLength; i++) {
            address recoveredAddress = ECDSAUpgradeable.recover(typedDataHash, sigs[i].v, sigs[i].r, sigs[i].s);

            require(recoveredAddress != address(0), "Error: signatrue address is 0");
            require(recoveredAddress == sigs[i].signatory, "Error: signatrue address is error");
            require(commitee[recoveredAddress], "Error: Signature address is not in commitee");

            // do a simple multiaddress check
            require(lastAddress != recoveredAddress, "Error: Signature address cant be same");
            lastAddress = recoveredAddress;
        }
    }

    /**
     * @dev See MultiSigInterface - addCommiteeMember
     * 
     * Requirements:
     * - new member not in commitee
     */ 
    function addCommiteeMember(address newMember) external override onlyOwner {
        require(!commitee[newMember], "Error: new member already exist in commitee");
        
        commitee[newMember] = true;

        emit CommiteeMemberChange(newMember, "add", block.timestamp);
    }

    /**
     * @dev See MultiSigInterface - removeCommiteeMember
     * 
     * Requirements:
     * - new member in commitee
     */ 
    function removeCommiteeMember(address newMember) external override onlyOwner {
        require(commitee[newMember], "Error: new member not exists in commitee");
        
        delete commitee[newMember];

        emit CommiteeMemberChange(newMember, "remove", block.timestamp);
    }

    /**
     * @dev See MultiSigInterface - setSigMin
     * 
     * Requirements:
     * - new sigs number cant equal old
     */ 
    function setSigMin(uint256 newSigsMin) external override onlyOwner {
        require(newSigsMin != sigsMin, "Error: sigs minimul is equal");

        emit SetSigMin(sigsMin, newSigsMin, block.timestamp);

        sigsMin = newSigsMin;
    }

    // uups interface
    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

}