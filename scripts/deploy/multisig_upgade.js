// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { ethers, upgrades } = require("hardhat");
const config = require("../../config/config.json");


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled

  await hre.run('compile');

  const multisig_contract = config.rinkeby.Multisig.address;

  const MultiSig = await ethers.getContractFactory('MultiSig');

  console.log('Upgrading MultiSig...');
  
  await upgrades.upgradeProxy(
    multisig_contract, 
    MultiSig,
    { 
      kind: "uups"
    }
  );
  console.log('MultiSig upgraded');

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
