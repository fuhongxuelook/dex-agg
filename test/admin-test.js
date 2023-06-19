const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Admin", function () {
  it("Should return the new transparent pattern once it's changed", async function () {
    // const Greeter = await ethers.getContractFactory("Greeter");
    // const greeter = await Greeter.deploy("Hello, world!");
    // await greeter.deployed();

    // expect(await greeter.greet()).to.equal("Hello, world!");

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");

  let provider = ethers.provider;
	let signer = provider.getSigner();

	let my_address = await signer.getAddress();

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


    // console.log(proxy);

    // let admin_address = await proxy.admin();

    // expect(admin_address).to.equal(my_address);

  });
});



