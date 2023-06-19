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

  let provider = ethers.provider;
  let signer = provider.getSigner();

  let my_address = await signer.getAddress();

  console.log("my address ", my_address);

  let fee_address = "0xAF702571cb3F0b9091C6E6c8B9731705E2ee0804"

  const perform = await hre.ethers.getContractFactory("Performer");
  const performer = await perform.deploy(fee_address)

  console.log("performer address is:", performer.address)
  await new Promise(r => setTimeout(r, 5000));

  // We get the contract to deploy
  const Lib = await hre.ethers.getContractFactory("AdapterSet");
  const lib = await Lib.deploy();

  await lib.deployed();

  console.log("Lib deployed to:", lib.address);
  await new Promise(r => setTimeout(r, 5000));
  

  // const Swap = await ethers.getContractFactory('Swap', {
  //   libraries: {
  //     AdapterSet: lib.address,
  //   }
  // });

  const Swap = await ethers.getContractFactory('Swap');

  console.log('Deploying Swap...');

  const swap = await upgrades.deployProxy(
    Swap, 
    [performer.address], 
    { 
      initializer: 'initialize',
      kind: "uups"
    }
  );
  await swap.deployed();
  console.log('Swap proxy deployed to:', swap.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
