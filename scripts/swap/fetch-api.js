// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fetch = require("node-fetch-commonjs");

const provider = hre.ethers.provider;

const owner = provider.getSigner()

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

async function main() {
      // Hardhat always runs the compile task when running scripts with its command
      // line interface.
      //
      // If this script is run directly using `node` you may want to call compile
      // manually to make sure everything is compiled

    const ETH = process.env.ETH;
    const USDC = process.env.USDC;
    let e = ethers.utils.parseEther("0.01")

    let queryParams = {
      destinationToken: USDC,
      sourceToken: ETH,
      sourceAmount: e.toString(),
      slippage: 1,
      timeout: "10000",
      recipientAddress: process.env.PERFORM,
    }

    let data = await apiRequestJson("137", queryParams);
    console.log(data);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



