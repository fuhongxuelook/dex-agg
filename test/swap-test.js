const { expect } = require("chai");
const { ethers } = require("hardhat");
const config = require("../config/config.json");

describe("registerAdapter", function () {
  it("Should return the new Swap once swap changed", async function () {
    
    let fee_address = "0xAF702571cb3F0b9091C6E6c8B9731705E2ee0804"

    const perform = await ethers.getContractFactory("Performer");
    const performer = await perform.deploy(fee_address)

    console.log("performer address is:", performer.address)

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


    console.log("swap address is:", swap.address);

 

    let _0x_router = config.polygon.Agg._0x.router;
    let _0x_proxy = config.polygon.Agg._0x.proxy;
    let _0x_name = config.polygon.Agg._0x.name;

    let register_0x_tx = await swap.registerAdapter(
      _0x_router,
      _0x_proxy,
      ethers.utils.formatBytes32String(_0x_name)
    );
    
    await register_0x_tx.wait();
    console.log("0x is registerred");

    let _0x_info = await swap.getAdapterByIndex(0);

    expect(_0x_info._router).to.equal(_0x_router);

    let _para_router = config.polygon.Agg.para.router;
    let _para_proxy = config.polygon.Agg.para.proxy;
    let _para_name = config.polygon.Agg.para.name;

    let register_para_tx = await swap.registerAdapter(
      _para_router,
      _para_proxy,
      ethers.utils.formatBytes32String(_para_name)
    );
    await register_para_tx.wait();
    console.log("para is registerred");

    let _para_info = await swap.getAdapterByIndex(1);

    expect(_para_info._router).to.equal(_para_router);

    let _1inch_router = config.polygon.Agg._1inch.router;
    let _1inch_proxy = config.polygon.Agg._1inch.proxy;
    let _1inch_name = config.polygon.Agg._1inch.name;

    let register_1inch_tx = await swap.registerAdapter(
      _1inch_router,
      _1inch_proxy,
      ethers.utils.formatBytes32String(_1inch_name)
    );
    await register_1inch_tx.wait();
    console.log("1inch is registerred");

    let _1inch_info = await swap.getAdapterByIndex(2);

    expect(_1inch_info._router).to.equal(_1inch_router);


  });
});
