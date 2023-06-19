// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { ethers, upgrades } = require("hardhat");


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled

  await hre.run('compile');

  const proxy_contract = process.env.SWAP;
  const swap_lib = process.env.LIB;

  const Swap = await ethers.getContractFactory('Swap', {
    libraries: {
      AdapterSet: swap_lib,
    }
  });

  console.log('Upgrading Swap...');
  
  await upgrades.upgradeProxy(
    proxy_contract, 
    Swap,
    { 
      unsafeAllow: [ "external-library-linking" ],
      kind: "uups"
    }
  );
  console.log('Swap upgraded');

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
