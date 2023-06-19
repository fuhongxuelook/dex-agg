const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("update fee address", function () {
  it("Should return the new FeeTo once it's changed", async function () {


    let fee_address = "0xAF702571cb3F0b9091C6E6c8B9731705E2ee0804"

    let new_fee_address = "0x60C29E6492fA5bC624E1ef1075F23dAE69d93ad5";

    const perform = await ethers.getContractFactory("Performer");
    const performer = await perform.deploy(fee_address)

    console.log("performer address is:", performer.address)

    let feeTo = await performer.feeTo();

    expect(feeTo).to.equal(fee_address);

    let update_feeto_tx = await performer.setFeeTo(new_fee_address);
    await update_feeto_tx.wait();

    let new_feeTo = await performer.feeTo();

    expect(new_feeTo).to.equal(new_fee_address);

  });
});
