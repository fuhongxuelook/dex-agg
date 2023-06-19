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

  let multisig = await hre.ethers.getContractAt("MultiSig", multisig_address, signer);
  
  let setsign_tx = await multisig.setSigMin(1);
  await setsign_tx.wait();
  console.log("set sign end");

  let add_tx = await multisig.addCommiteeMember(myaddr);
  await add_tx.wait();

  console.log("end");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
