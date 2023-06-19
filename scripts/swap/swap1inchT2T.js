// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

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

  const ETH = process.env.ETH;
  const USDC = process.env.USDC;
  const USDT = process.env.USDT;

  const swapContract = process.env.SWAP;
  let swap = await hre.ethers.getContractAt("Swap", swapContract, signer);

  // let _1inch = "0x1111111254fb6c44bac0bed2854e76f90643097d";
  // let _proxy = "0x1111111254fb6c44bac0bed2854e76f90643097d";
  // let _name = "1inch";

  // let registerTx = await swap.registerAdapter(
  //   _1inch,
  //   _proxy,
  //   hre.ethers.utils.formatBytes32String(_name)
  // );

  // await registerTx.wait();
  // console.log("1inch router is registerred");

  // let index = await swap.getAdapterByIndex(1);
  // console.log(index);
  // return;

  let overrides = {
    value: ethers.utils.parseEther("0")
  };

  let data = "0x7c025200000000000000000000000000521709b3cd7f07e29722be0ba28a8ce0e806dbc3000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001800000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa84174000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f0000000000000000000000004b1f1e2435a9c96f7330faea190ef6a7c8d700010000000000000000000000004d402320e596dae065c840733a4f69dc271e886000000000000000000000000000000000000000000000000000000000000186a0000000000000000000000000000000000000000000000000000000000001832300000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020800000000000000000000000521709b3cd7f07e29722be0ba28a8ce0e806dbc30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a4b757fed60000000000000000000000004b1f1e2435a9c96f7330faea190ef6a7c8d700010000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa84174000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f0000000000000000002dc6c01111111254fb6c44bac0bed2854e76f90643097d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000cfee7c08";
 
  let swapTx = await swap.swap(
  	2,
  	USDC,
  	USDT,
  	100000,
  	,
  	overrides
  	);
  await swapTx.wait()

  console.log("end");



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
