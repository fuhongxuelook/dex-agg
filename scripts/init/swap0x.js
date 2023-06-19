// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const config = require("../../config/config.json");

async function main() {

  let provider = hre.ethers.provider;
  let signer = provider.getSigner();

  const myaddr = await signer.getAddress();

  console.log(myaddr);
  console.log(await signer.getBalance());

  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled

  await hre.run('compile');

  const swapContract = config.polygon.Swap.proxy;
  let swap = await hre.ethers.getContractAt("Swap", swapContract, signer);


  let _router = config.polygon.Agg._0x.router;
  let _proxy = config.polygon.Agg._0x.proxy;
  let _name = config.polygon.Agg._0x.name;

  let registerTx = await swap.registerAdapter(
    _router,
    _proxy,
    hre.ethers.utils.formatBytes32String(_name)
  );
  await registerTx.wait();
  
  console.log("0x router is registerred");

  let index = await swap.getAdapterByIndex(0);
  console.log(index);

  console.log("end");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
