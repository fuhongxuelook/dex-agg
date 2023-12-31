// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {


    let provider = hre.ethers.provider;
    let signer = provider.getSigner();

    let my_address = await signer.getAddress();

    console.log("my_address: ", my_address)

    console.log(my_address);

  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled

  // await hre.run('compile');

  // We get the contract to deploy
  const Lib = await hre.ethers.getContractFactory("TransferHelper");
  const lib = await Lib.deploy();

  await lib.deployed();

  console.log("Lib deployed to:", lib.address);
  // We get the contract to deploy
  const Obj = await hre.ethers.getContractFactory("Swap", {
    libraries: {
      TransferHelper: lib.address,
    }
  });
  const prestake = await Obj.deploy();

  await prestake.deployed();

  console.log("Swap deployed to:", prestake.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
