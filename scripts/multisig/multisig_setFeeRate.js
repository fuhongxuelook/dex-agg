// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const config = require("../../config/config.json");
const hre = require("hardhat");


async function main() {

  let provider = hre.ethers.provider;
  let signer = provider.getSigner();

  const myaddr = await signer.getAddress();

  console.log(myaddr);

  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled

  await hre.run('compile');

  const multisig_address = config.rinkeby.Multisig.address;
  const swap_address = config.rinkeby.Swap.proxy;
  const perform_address = config.rinkeby.Swap.perform;

  let multisig = await hre.ethers.getContractAt("MultiSig", multisig_address, signer);

  let block = await provider.getBlock();
  console.log(block.timestamp);

  const domain = {
      name: "SAVI",
      version: "1.0",
      chainId: 4,
      verifyingContract: multisig_address
  };

  // The named list of all type definitions
  // SetFeeRate(address performer,uint256 feeRate,uint256 chainId,uint256 nonce,uint256 deadline)
  const types = {
      SetFeeRate: [
        {name: "performer", type: "address" },
        {name: "feeRate", type: "uint256" },
        {name: "chainId", type: "uint256" },
        {name: "nonce", type: "uint256" },
        {name: "deadline", type: "uint256" }
      ]
  };

  let nonce = await multisig.nonces();

  // The data to sign
  const value = {
      performer: perform_address,
      feeRate: 7,
      chainId: 4,
      nonce: nonce,
      deadline: block.timestamp + 100
  };

  console.log("value is", value);

  sig = await signer._signTypedData(domain, types, value);

  let splitedSig = ethers.utils.splitSignature(sig)
  console.log("splited sig:", splitedSig)

  let mySig = {
    "signatory": myaddr,
    "v" : splitedSig.v,
    "r" : splitedSig.r,
    "s" : splitedSig.s
  }

  let sg_tx = await multisig.setFeeRateBySigs([mySig], perform_address, 7, block.timestamp + 100)
  await sg_tx.wait();

  console.log("end", sg_tx);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
