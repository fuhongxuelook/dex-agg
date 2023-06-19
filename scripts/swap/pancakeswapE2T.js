// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const config = require("../../config/config.json");
const hre = require("hardhat");
const fetch = require("node-fetch-commonjs");



async function apiRequestJson(chain, queryParams) {
    api_base = process.env.API + chain;
    let response = await fetch(api_base, {
        method: 'post',
        body: JSON.stringify(queryParams),
        headers: {'Content-Type': 'application/json'}
    });
    let data = await response.json();
    return data;
}


function filterData(agg, data) {
  let aggs = data.agg;
  let len = aggs.length;
  for(let i = 0; i < aggs.length; i ++) {
    let item = aggs[i];
    if(item.Agg == agg) {
      return item.data;
    }
  }
 
}

const abi = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function allowance(address owner, address spender) public view returns (uint256)"
];

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

  const ETH = config.bsc.Token.ETH;
  const BUSD = config.bsc.Token.BUSD;
  const swapContract = config.bsc.Swap.proxy;

  const erc20 = new ethers.Contract(BUSD, abi, signer);


  let swap = await hre.ethers.getContractAt("Swap", swapContract, signer);

  let e = ethers.utils.parseEther("0.01")

  let overrides = {
    value: e
  };

  // let swapAmount = ethers.utils.parseUnits("0.01" , 18);

  // // check allowance
  // let allowance = await erc20.allowance(myaddr, swapContract);
  // console.log("allowance is", allowance.toString());

  // if(allowance < swapAmount) {
  //     let approve_tx = await erc20.approve(swapContract, ethers.constants.MaxUint256);
  //     await approve_tx.wait();

  //     console.log("approve end");
  // }


  let queryParams = {
    destinationToken: BUSD,
    sourceToken: ETH,
    sourceAmount: e.toString(),
    slippage: 1,
    timeout: "10000",
    recipientAddress: config.bsc.Swap.perform,
  }

  let response = await apiRequestJson("56", queryParams)

  let data = filterData("Pancake", response);
    
  if(data == "") {
    console.log("data cant fetched", data);
  }

  let swapTx = await swap.swap(
    0,
    ETH,
    BUSD,
    e,
    data,
    overrides);
  await swapTx.wait()

  console.log("end");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
