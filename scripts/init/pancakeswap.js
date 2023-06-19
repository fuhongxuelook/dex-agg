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

  const proxy_contract = config.bsc.Swap.proxy;
  let proxy = await hre.ethers.getContractAt("Swap", proxy_contract, signer);

  let _router = config.bsc.Agg.pancake.router;
  let _proxy = config.bsc.Agg.pancake.proxy;
  let _name = config.bsc.Agg.pancake.name;

  let registerTx = await proxy.registerAdapter(
    _router,
    _proxy,
    hre.ethers.utils.formatBytes32String(_name)
  );
  await registerTx.wait();
  console.log("pancake router is registerred");

  let index = await proxy.getAdapterByIndex(0);
  console.log(index);

  console.log(hre.ethers.utils.parseBytes32String(index._name));

  console.log("end");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
