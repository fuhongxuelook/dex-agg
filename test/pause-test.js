const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("registerAdapter", function () {
  it("Should return the new Swap once it's changed", async function () {
    // const Greeter = await ethers.getContractFactory("Greeter");
    // const greeter = await Greeter.deploy("Hello, world!");
    // await greeter.deployed();

    // expect(await greeter.greet()).to.equal("Hello, world!");

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");



    let fee_address = "0xAF702571cb3F0b9091C6E6c8B9731705E2ee0804"

    const perform = await ethers.getContractFactory("Performer");
    const performer = await perform.deploy(fee_address)

    console.log("performer address is:", performer.address)

    // We get the contract to deploy
    const Lib = await ethers.getContractFactory("AdapterSet");
    const lib = await Lib.deploy();

    await lib.deployed();

    console.log("Lib deployed to:", lib.address);

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
      }
    );
    await swap.deployed();

    let pause_tx = await swap.pause();
    await pause_tx.wait();

    let paused = await swap.paused();

    expect(paused).to.equal(true);

    let unpause_tx = await swap.unpause();
    await unpause_tx.wait();

    paused = await swap.paused();
    expect(paused).to.equal(false);

  });
});
