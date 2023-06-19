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


  const swapContract = process.env.SWAP;
  let swap = await hre.ethers.getContractAt("Swap", swapContract, signer);

  let overrides = {
    value: ethers.utils.parseEther("0")
  };

  let data = "0x7c025200000000000000000000000000521709b3cd7f07e29722be0ba28a8ce0e806dbc3000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001800000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa84174000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000010d39a3fb1ef2647f6e93635cbd179918e2b9fb50000000000000000000000004d402320e596dae065c840733a4f69dc271e886000000000000000000000000000000000000000000000000000000000000186a0000000000000000000000000000000000000000000000000022332552d61f85b00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005e000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000380000000000000000000000000521709b3cd7f07e29722be0ba28a8ce0e806dbc30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a4b757fed600000000000000000000000010d39a3fb1ef2647f6e93635cbd179918e2b9fb50000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa841740000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf12700000000000000000002dc6c0521709b3cd7f07e29722be0ba28a8ce0e806dbc3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000521709b3cd7f07e29722be0ba28a8ce0e806dbc300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000014414284aab000000000000000000000000000000000000000000000000000000000000008080000000000000000000000000000000000000000000000000000000000000040000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf127000000000000000000000000000000001000000000000000000000000000000018000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf12700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000242e1a7d4d00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000521709b3cd7f07e29722be0ba28a8ce0e806dbc300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000018414284aab00000000000000000000000000000000000000000000000000000000000000808000000000000000000000000000000000000000000000000000000000000044000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000100000000000000000000000000000001000000000000000000000000521709b3cd7f07e29722be0ba28a8ce0e806dbc3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000064d1660f99000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000001111111254fb6c44bac0bed2854e76f90643097d00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000cfee7c08";
  
  let swapTx = await swap.swap(
  	1,
  	USDC,
  	ETH,
  	100000,
  	data,
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
